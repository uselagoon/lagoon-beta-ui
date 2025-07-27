import type { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import { headers } from 'next/headers';

import RefreshTokenHandler from '@/components/auth/RefreshTokenHandler';
import Plugins from '@/components/plugins/plugins';
import PublicRuntimeEnvProvider from '@/contexts/PublicRuntimeEnvProvider';
import { ApolloClientComponentWrapper } from '@/lib/apollo-client-components';

import ClientSessionWrapper from '../components/auth/ClientSessionWrapper';
import AppProvider from '../contexts/AppContext';
import AuthProvider from '../contexts/AuthProvider';
import LinkProvider from '../contexts/LinkProvider';

import './globals.css';
import '@uselagoon/ui-library/dist/ui-library.css';

export const metadata: Metadata = {
  title: 'Lagoon UI',
  icons: {
    icon: [
      { url: '/favicons/favicon.ico' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/favicons/apple-touch-icon.png' }],
  },
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') as string;

  // ref for exposing custom variables at runtime: https://github.com/expatfile/next-runtime-env/blob/development/docs/EXPOSING_CUSTOM_ENV.md
  noStore();
  return (
    <html lang="en">
      <PublicRuntimeEnvProvider>
        <head>
          <Plugins hook="head" nonce={nonce} />
        </head>
        <body>
          <LinkProvider>
            <AuthProvider>
              <RefreshTokenHandler />
              <ClientSessionWrapper>
                <ApolloClientComponentWrapper>
                  <AppProvider kcUrl={process.env.AUTH_KEYCLOAK_ISSUER!}>{children}</AppProvider>
                </ApolloClientComponentWrapper>
              </ClientSessionWrapper>
            </AuthProvider>
          </LinkProvider>
          <Plugins hook="body" nonce={nonce} />
        </body>
      </PublicRuntimeEnvProvider>
    </html>
  );
}
