/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';

import { HttpResponse, type ApiErrorItem } from '../utils/http-response';
import { WinstonLoggerService } from '../libs/winston-logger.service';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toPathString(path: unknown): string | undefined {
  if (Array.isArray(path)) return path.map(String).join('.');
  if (typeof path === 'string') return path;
  return undefined;
}

function normalizeErrorsFromHttpExceptionResponse(exceptionResponse: unknown): {
  message: string;
  errors?: ApiErrorItem[];
} {
  if (typeof exceptionResponse === 'string') {
    return { message: exceptionResponse };
  }

  if (!isPlainObject(exceptionResponse)) {
    return { message: 'Request failed' };
  }

  const msg = (exceptionResponse as any).message;
  const explicitErrors = (exceptionResponse as any).errors;

  // If you already throw HttpException({ message, errors }), respect it.
  if (typeof msg === 'string' && Array.isArray(explicitErrors)) {
    return { message: msg, errors: explicitErrors as ApiErrorItem[] };
  }

  // If message is array => treat as validation details
  if (Array.isArray(msg)) {
    const errors = msg
      .map((m) => (typeof m === 'string' ? ({ message: m } as ApiErrorItem) : null))
      .filter(Boolean) as ApiErrorItem[];

    return {
      message: 'Validation failed',
      errors: errors.length ? errors : undefined,
    };
  }

  if (typeof msg === 'string') {
    return { message: msg };
  }

  if (typeof (exceptionResponse as any).error === 'string') {
    return { message: (exceptionResponse as any).error };
  }

  return { message: 'Request failed' };
}

function normalizeZodLikeError(
  exception: unknown,
): { message: string; errors: ApiErrorItem[] } | null {
  if (!isPlainObject(exception)) return null;
  const issues = (exception as any).issues;
  if (!Array.isArray(issues)) return null;

  const errors: ApiErrorItem[] = issues.map((issue: any) => ({
    path: toPathString(issue?.path),
    message: typeof issue?.message === 'string' ? issue.message : 'Invalid value',
    code: typeof issue?.code === 'string' ? issue.code : undefined,
  }));

  return {
    message: 'Validation failed',
    errors: errors.length ? errors : [{ message: 'Validation failed' }],
  };
}

function normalizePrismaLikeError(
  exception: unknown,
): { message: string; errors?: ApiErrorItem[] } | null {
  if (!isPlainObject(exception)) return null;

  const code = (exception as any).code;
  if (typeof code !== 'string' || !code.startsWith('P')) return null;

  const base: ApiErrorItem = {
    message: (exception as any).message ? String((exception as any).message) : 'Database error',
    code,
  };

  const target = (exception as any).meta?.target;
  if (Array.isArray(target)) base.path = target.map(String).join('.');
  else if (typeof target === 'string') base.path = target;

  if (code === 'P2002') {
    return { message: 'Duplicate value', errors: [{ ...base, message: 'Value already exists' }] };
  }

  return { message: 'Database error', errors: [base] };
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = statusCode >= 500 ? 'Internal server error' : 'Request failed';
    let errors: ApiErrorItem[] | undefined;

    const zodNorm = normalizeZodLikeError(exception);
    if (zodNorm) {
      message = zodNorm.message;
      errors = zodNorm.errors;
    } else {
      const prismaNorm = normalizePrismaLikeError(exception);
      if (prismaNorm) {
        message = prismaNorm.message;
        errors = prismaNorm.errors;
      } else if (exception instanceof HttpException) {
        const norm = normalizeErrorsFromHttpExceptionResponse(exception.getResponse());
        message = norm.message;
        errors = norm.errors;
      } else if (exception instanceof Error) {
        message = statusCode >= 500 ? 'Internal server error' : exception.message || message;
      }
    }

    // Logging detail for server-side diagnostics
    const logPayload = {
      statusCode,
      method: request.method,
      path: request.url,
      message,
      errors,
      exception,
    };

    if (statusCode >= 500) this.logger.error(JSON.stringify(logPayload));
    else this.logger.warn(JSON.stringify(logPayload));

    return response.status(statusCode).json(HttpResponse.error(message, errors));
  }
}
