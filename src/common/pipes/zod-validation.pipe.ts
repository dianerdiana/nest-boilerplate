import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { type ZodType } from 'zod';

type ZodIssueDetail = {
  path?: string;
  message: string;
};

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: unknown) {
    const parsed = this.schema.safeParse(value);

    if (parsed.success) {
      return parsed.data;
    }

    const errors: ZodIssueDetail[] = parsed.error.issues.map((issue) => ({
      path: issue.path.length ? issue.path.join('.') : undefined,
      message: issue.message,
    }));

    throw new BadRequestException({
      message: 'Validation failed',
      errors,
    });
  }
}
