import { PrismaService } from '@/common/libs/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  findOne({ id }: { id: number }) {
    return this.prisma.role.findFirst({ where: { id } });
  }
}
