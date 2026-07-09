import React from 'react';
import {
  Body,
  Button,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import type { SessionMetadata } from '@/shared/types/session-metadata.types';

interface PasswordRecoveryTemplateProps {
  domain: string;
  token: string;
  metadata: SessionMetadata;
}

export function PasswordRecoveryTemplate({
  domain,
  token,
  metadata,
}: PasswordRecoveryTemplateProps) {
  const resetPasswordUrl = `${domain}/account/recovery/${token}`;

  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Tailwind>
        <Body className="mx-auto max-w-2xl bg-slate-50 p-6">
          <Section className="mb-8 text-center">
            <Heading className="text-2xl font-bold text-slate-800">
              Reset your password
            </Heading>
            <Text className="text-slate-600">
              We received a request to reset your password. Click the button
              below to choose a new one.
            </Text>
            <Button
              href={resetPasswordUrl}
              className="rounded-md bg-blue-500 px-4 py-2 text-white"
            >
              Reset password
            </Button>
          </Section>

          <Section className="mb-8 rounded-md bg-white p-4">
            <Heading className="mb-2 text-lg font-semibold text-slate-800">
              Request details
            </Heading>
            <Text className="text-slate-600">
              Browser: {metadata.device.browser}
            </Text>
            <Text className="text-slate-600">OS: {metadata.device.os}</Text>
            <Text className="text-slate-600">IP: {metadata.ip}</Text>
            <Text className="text-slate-600">
              Location: {metadata.location.city}, {metadata.location.country}
            </Text>
          </Section>

          <Section>
            <Text className="text-slate-600">
              If you did not request a password reset, you can safely ignore
              this email. If you have any questions, contact us at{' '}
              <Link href="mailto:support@example.com">
                support@example.com
              </Link>
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}
