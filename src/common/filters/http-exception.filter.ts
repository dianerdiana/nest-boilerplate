/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

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

function normalizeHttpExceptionResponse(exceptionResponse: unknown): {
  message: string;
  errors?: ApiErrorItem[];
} {
  if (typeof exceptionResponse === 'string') {
    return { message: exceptionResponse };
  }

  if (!isPlainObject(exceptionResponse)) {
    return { message: 'Request failed' };
  }

  const message = exceptionResponse.message;
  const errors = exceptionResponse.errors;

  // Preferred custom shape: { message: string, errors: ApiErrorItem[] }
  if (typeof message === 'string' && Array.isArray(errors)) {
    return {
      message,
      errors: errors as ApiErrorItem[],
    };
  }

  // Fallback: { message: string }
  if (typeof message === 'string') {
    return { message };
  }

  // Fallback: { message: string[] }
  if (Array.isArray(message)) {
    return {
      message: 'Validation failed',
      errors: message
        .filter((item): item is string => typeof item === 'string')
        .map((item) => ({ message: item })),
    };
  }

  if (typeof exceptionResponse.error === 'string') {
    return { message: exceptionResponse.error };
  }

  return { message: 'Request failed' };
}

function normalizeZodLikeError(
  exception: unknown,
): { message: string; errors: ApiErrorItem[] } | null {
  if (!isPlainObject(exception) || !Array.isArray(exception.issues)) {
    return null;
  }

  const errors: ApiErrorItem[] = exception.issues.map((issue: any) => ({
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

  const code = exception.code;
  if (typeof code !== 'string' || !code.startsWith('P')) return null;

  const target = isPlainObject(exception.meta) ? exception.meta.target : undefined;

  let path: string | undefined;
  if (Array.isArray(target)) path = target.map(String).join('.');
  else if (typeof target === 'string') path = target;

  if (code === 'P2002') {
    return {
      message: 'Duplicate value',
      errors: [
        {
          path,
          message: 'Value already exists',
          code,
        },
      ],
    };
  }

  return {
    message: 'Database error',
    errors: [
      {
        path,
        message: typeof exception.message === 'string' ? exception.message : 'Database error',
        code,
      },
    ],
  };
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

    const zodError = normalizeZodLikeError(exception);
    if (zodError) {
      message = zodError.message;
      errors = zodError.errors;
    } else {
      const prismaError = normalizePrismaLikeError(exception);
      if (prismaError) {
        message = prismaError.message;
        errors = prismaError.errors;
      } else if (exception instanceof HttpException) {
        const normalized = normalizeHttpExceptionResponse(exception.getResponse());
        message = normalized.message;
        errors = normalized.errors;
      } else if (exception instanceof Error) {
        message = statusCode >= 500 ? 'Internal server error' : exception.message;
      }
    }

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
