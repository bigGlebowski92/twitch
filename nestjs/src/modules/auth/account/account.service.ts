import { Injectable } from '@nestjs/common';
import { User } from '@prisma/generated/browser';
import { PrismaService } from '@/core/prisma/prisma.service';

@Injectable()
export class AccountService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findAll(): Promise<User[]> {
    const users = await this.prismaService.user.findMany();
    return users;
  }
}
