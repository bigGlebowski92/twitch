import React from 'react';
import {
  Body,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface AccountDeletionTemplateProps {
  domain: string;
  username: string;
  email: string;
}

export function AccountDeletionTemplate({
  domain,
  username,
  email,
}: AccountDeletionTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Your account has been permanently deleted</Preview>
      <Tailwind>
        <Body className="mx-auto max-w-2xl bg-slate-50 p-6">
          <Section className="mb-8 text-center">
            <Heading className="text-2xl font-bold text-slate-800">
              Account permanently deleted
            </Heading>
            <Text className="text-slate-600">
              Hi {username}, your Twitch account ({email}) has been completely
              removed from our systems.
            </Text>
          </Section>

          <Section className="mb-8 rounded-md bg-white p-4">
            <Heading className="mb-2 text-lg font-semibold text-slate-800">
              What this means
            </Heading>
            <Text className="text-slate-600">
              Your profile, sessions, and associated account data have been
              permanently deleted. This action cannot be undone.
            </Text>
            <Text className="text-slate-600">
              If you did not request this deletion, please contact us
              immediately.
            </Text>
          </Section>

          <Section>
            <Text className="text-slate-600">
              You can create a new account anytime at{' '}
              <Link href={domain}>{domain}</Link>. If you have any questions,
              contact us at{' '}
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
