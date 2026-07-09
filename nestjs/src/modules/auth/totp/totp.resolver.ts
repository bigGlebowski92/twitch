import { Args, Mutation, Resolver } from '@nestjs/graphql';
import type { User } from '@prisma/generated/browser';
import { Authorization } from '@/shared/decorators/auth.decorator';
import { Authorized } from '@/shared/decorators/authorized.decorator';
import { EnableTotpInput } from './inputs/enable-totp.input';
import { TotpModel } from './models/totp.model';
import { TotpService } from './totp.service';

@Resolver('Totp')
export class TotpResolver {
  constructor(private readonly totpService: TotpService) {}

  @Authorization()
  @Mutation(() => TotpModel, { name: 'generateTotp' })
  public async generateTotp(@Authorized() user: User): Promise<TotpModel> {
    return this.totpService.generate(user);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'enableTotp' })
  public async enableTotp(
    @Authorized() user: User,
    @Args('input') input: EnableTotpInput,
  ): Promise<boolean> {
    return this.totpService.enable(user, input);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'disableTotp' })
  public async disableTotp(@Authorized() user: User): Promise<boolean> {
    return this.totpService.disable(user);
  }
}
