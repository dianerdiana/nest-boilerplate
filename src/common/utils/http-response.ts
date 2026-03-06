// http-response.ts
import { RESPONSE_STATUS } from '../constants/response-status.constant';

export type ApiStatus = (typeof RESPONSE_STATUS)[keyof typeof RESPONSE_STATUS];

export type ApiErrorItem = {
  path?: string;
  message: string;
  code?: string;
};

export type PaginationMeta = {
  limit: number;
  page: number;
  search?: string;
  column?: string;
  sort?: string;
};

export class HttpResponse<TData = unknown> {
  status: ApiStatus;
  message: string;
  data?: TData;
  meta?: PaginationMeta;
  errors?: ApiErrorItem[];

  constructor(
    args: {
      status?: ApiStatus;
      message?: string;
      data?: TData;
      meta?: PaginationMeta;
      errors?: ApiErrorItem[];
    } = {},
  ) {
    const { status = RESPONSE_STATUS.success, message = 'ok', data, meta, errors } = args;

    this.status = status;
    this.message = message;

    if (data !== undefined) this.data = data;
    if (meta !== undefined) this.meta = meta;
    if (errors?.length) this.errors = errors;
  }

  static success<TData>(args?: { data?: TData; message?: string; meta?: PaginationMeta }) {
    return new HttpResponse<TData>({
      status: RESPONSE_STATUS.success,
      message: args?.message ?? 'ok',
      data: args?.data,
      meta: args?.meta,
    });
  }

  static error(message: string, errors?: ApiErrorItem[]) {
    return new HttpResponse<never>({
      status: RESPONSE_STATUS.error,
      message,
      errors,
    });
  }
}
