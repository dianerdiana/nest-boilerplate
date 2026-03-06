import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

export function Serialize(dto: any) {
  console.log(dto);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return UseInterceptors(new SerializeInterceptor(dto));
}
