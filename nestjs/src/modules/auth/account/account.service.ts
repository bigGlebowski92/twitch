import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/generated/browser';
import { hash } from 'argon2';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { CreateUserInput } from './inputs/create-user.input';

@Injectable()
export class AccountService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  public async create(input: CreateUserInput): Promise<User> {
    const { username, email, password } = input;
    const isUsernameExists = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });
    if (isUsernameExists) {
      throw new BadRequestException('Username already exists');
    }
    const isEmailExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (isEmailExists) {
      throw new BadRequestException('Email already exists');
    }
    const user = await this.prismaService.user.create({
      data: {
        username,
        email,
        password: await hash(password),
        displayName: username,
        bio: '',
      },
    });
    return user;
  }
}
