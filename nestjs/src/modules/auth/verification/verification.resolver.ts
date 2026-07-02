import { Resolver } from '@nestjs/graphql';
import { VerificationService } from './verification.service';

@Resolver('Verification')
export class VerificationResolver {
  constructor(private readonly verificationService: VerificationService) {}
}
