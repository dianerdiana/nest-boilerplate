import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

import { Request, Response } from 'express';

import { WinstonLoggerService } from '../libs/winston-logger.service';
import { type ApiErrorItem, HttpResponse } from '../utils/http-response';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeErrorItem(item: unknown): ApiErrorItem | null {
  if (typeof item === 'string') {
    return { message: item };
  }

  if (!isPlainObject(item)) {
    return null;
  }

  const message = typeof item.message === 'string' ? item.message : 'Request failed';
  const path = typeof item.path === 'string' && item.path.trim() ? item.path : undefined;

  return { path, message };
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

  const message =
    typeof exceptionResponse.message === 'string' ? exceptionResponse.message : 'Request failed';

  const rawErrors = Array.isArray(exceptionResponse.errors) ? exceptionResponse.errors : undefined;

  const errors = rawErrors
    ?.map((item) => normalizeErrorItem(item))
    .filter((item): item is ApiErrorItem => item !== null);

  return {
    message,
    errors: errors?.length ? errors : undefined,
  };
}

function normalizePrismaLikeError(
  exception: unknown,
): { message: string; errors?: ApiErrorItem[] } | null {
  if (!isPlainObject(exception)) {
    return null;
  }

  const code = exception.code;
  if (typeof code !== 'string' || !code.startsWith('P')) {
    return null;
  }

  const target = isPlainObject(exception.meta) ? exception.meta.target : undefined;

  let path: string | undefined;
  if (Array.isArray(target)) {
    path = target.map(String).join('.');
  } else if (typeof target === 'string') {
    path = target;
  }

  if (code === 'P2002') {
    return {
      message: 'Duplicate value',
      errors: [
        {
          path,
          message: 'Value already exists',
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
    let trace: string | undefined;

    const prismaError = normalizePrismaLikeError(exception);
    if (prismaError) {
      message = prismaError.message;
      errors = prismaError.errors;
    } else if (exception instanceof HttpException) {
      const normalized = normalizeHttpExceptionResponse(exception.getResponse());
      message = normalized.message;
      errors = normalized.errors;
    } else if (exception instanceof Error) {
      message = exception.message;
      trace = exception.stack;
    }

    const logPayload = `[STATUS_CODE]: ${statusCode} - [METHOD]: ${request.method} - [PATH]: ${request.url} - [MESSAGE]: ${message} - [ERRORS]: ${errors ? JSON.stringify(errors) : '?'} - [EXCEPTIONS]: ${JSON.stringify(exception)}`;

    if (statusCode >= 500) {
      this.logger.error(logPayload, trace);
    } else {
      this.logger.warn(logPayload);
    }

    return response.status(statusCode).json(HttpResponse.error(message, errors));
  }
}
