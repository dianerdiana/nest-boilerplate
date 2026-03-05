import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { type ZodType } from 'zod';

type ZodIssueDetail = {
  path: string;
  message: string;
  code: string;
};

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: unknown) {
    const parsed = this.schema.safeParse(value);
    if (parsed.success) return parsed.data;

    const details: ZodIssueDetail[] = parsed.error.issues.map((i) => ({
      path: i.path?.length ? i.path.join('.') : '',
      message: i.message,
      code: i.code,
    }));

    const first = details[0];
    const firstMessage = first
      ? first.path
        ? `${first.path}: ${first.message}`
        : first.message
      : 'Validation failed';

    throw new BadRequestException({
      message: [firstMessage], // ringkas (filter Anda pakai ini)
      errors: details, // detail untuk FE
      error: 'Bad Request',
      statusCode: 400,
    });
  }
}
