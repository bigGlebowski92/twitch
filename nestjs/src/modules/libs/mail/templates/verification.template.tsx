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

interface VerificationTemplateProps {
  domain: string;
  token: string;
}

export function VerificationTemplate({
  domain,
  token,
}: VerificationTemplateProps) {
  const verificationUrl = `${domain}/account/verify?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>Verify your email</Preview>
      <Tailwind>
        <Body className="mx-auto max-w-2xl bg-slate-50 p-6">
          <Section className="mb-8 text-center">
            <Heading className="text-2xl font-bold text-slate-800">
              Verify your email
            </Heading>
            <Text className="text-slate-600">
              Click the button below to verify your email.
            </Text>
            <Button
              href={verificationUrl}
              className="rounded-md bg-blue-500 px-4 py-2 text-white"
            >
              Verify email
            </Button>
          </Section>

          <Section>
            <Text className="text-slate-600">
              If you have any questions, please contact us at{' '}
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