import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/common/libs/prisma.service';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUnique(id: number) {
    return this.prisma.role.findUnique({ where: { id } });
  }
}
