import { RESPONSE_STATUS } from '../constants/response-status.constant';

export type ApiStatus = (typeof RESPONSE_STATUS)[keyof typeof RESPONSE_STATUS];

export type ApiErrorItem = {
  path?: string;
  message: string;
  code?: string;
};

export class HttpResponse<TData = unknown> {
  status: ApiStatus;
  message: string;
  data?: TData;
  errors?: ApiErrorItem[];

  constructor(
    args: {
      status?: ApiStatus;
      message?: string;
      data?: TData;
      errors?: ApiErrorItem[];
    } = {},
  ) {
    const { status = RESPONSE_STATUS.success, message = 'ok', data, errors } = args;

    this.status = status;
    this.message = message;

    if (data !== undefined) this.data = data;
    if (errors?.length) this.errors = errors;
  }

  static success<TData>(data?: TData, message = 'ok') {
    return new HttpResponse<TData>({ status: RESPONSE_STATUS.success, message, data });
  }

  static error(message: string, errors?: ApiErrorItem[]) {
    return new HttpResponse<never>({ status: RESPONSE_STATUS.error, message, errors });
  }
}
