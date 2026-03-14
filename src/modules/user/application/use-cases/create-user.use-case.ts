import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/common/libs/prisma.service';

import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly prisma: PrismaService) {}

  execute(dto: CreateUserDto) {}
}
