import { RESPONSE_STATUS } from '../constants/response-status.constant';
import { ResponseMeta } from '../types/response-meta.type';

export type ApiStatus = (typeof RESPONSE_STATUS)[keyof typeof RESPONSE_STATUS];

export type ApiErrorItem = {
  path?: string;
  message: string;
};

export class HttpResponse<TData = unknown> {
  status: ApiStatus;
  message: string;
  data?: TData;
  meta?: ResponseMeta;
  errors?: ApiErrorItem[];

  constructor(
    args: {
      status?: ApiStatus;
      message?: string;
      data?: TData;
      meta?: ResponseMeta;
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

  static success<TData>(
    args: {
      data?: TData;
      message?: string;
      meta?: ResponseMeta;
    } = {},
  ) {
    return new HttpResponse<TData>({
      status: RESPONSE_STATUS.success,
      message: args.message ?? 'ok',
      data: args.data,
      meta: args.meta,
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
