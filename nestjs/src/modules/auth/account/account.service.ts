import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/generated/browser';
import { hash, verify } from 'argon2';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { VerificationService } from '../verification/verification.service';
import { ChangeEmailInput } from './inputs/change-email.input';
import { ChangePasswordInput } from './inputs/change-password.input';
import { CreateUserInput } from './inputs/create-user.input';

@Injectable()
export class AccountService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly verificationService: VerificationService,
  ) {}

  public async me(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
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
    await this.verificationService.sendVerificationEmail(user);
    return user;
  }

  public async changeEmail(user: User, input: ChangeEmailInput): Promise<User> {
    const { email } = input;
    const isEmailExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (isEmailExists && isEmailExists.id !== user.id) {
      throw new BadRequestException('Email already exists');
    }
    return this.prismaService.user.update({
      where: { id: user.id },
      data: { email },
    });
  }

  public async changePassword(
    user: User,
    input: ChangePasswordInput,
  ): Promise<User> {
    const { oldPassword, newPassword } = input;
    const isPasswordValid = await verify(user.password, oldPassword);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
    return this.prismaService.user.update({
      where: { id: user.id },
      data: { password: await hash(newPassword) },
    });
  }
}
