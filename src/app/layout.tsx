import type { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';

import RefreshTokenHandler from '@/components/auth/RefreshTokenHandler';
import Plugins from '@/components/plugins/plugins';
import ProgressProvider from '@/contexts/ProgressProvider';
import PublicRuntimeEnvProvider from '@/contexts/PublicRuntimeEnvProvider';
import { ApolloClientComponentWrapper } from '@/lib/apollo-client-components';

import ClientSessionWrapper from '../components/auth/ClientSessionWrapper';
import AppProvider from '../contexts/AppContext';
import AuthProvider from '../contexts/AuthProvider';
import LinkProvider from '../contexts/LinkProvider';
import './globals.css';
import fs from 'fs';
import {OverrideProvider} from "@/contexts/OverrideContext";
import * as process from "node:process";
import { validateOverrides, type Overrides } from '@uselagoon/ui-library/schemas';

function loadOverrides() : Overrides {
  try {
    if (fs.existsSync('overrides.json')) {
      const overrideData = fs.readFileSync('overrides.json', 'utf-8');

      const { valid, errors } = validateOverrides(JSON.parse(overrideData))

      if (errors.length > 0) {
        console.log('Invalid overrides detected:\n');
        errors.forEach(err => {
          console.log(`- ${err.key}: ${err.message}`);
        });
      } else {
        console.log('Overrides loaded successfully');
      }

      return valid;
    }
  } catch (error) {
      console.log('Error loading overrides:', error);
    }
  return {};
}

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
  const overrides = loadOverrides();
  // ref for exposing custom variables at runtime: https://github.com/expatfile/next-runtime-env/blob/development/docs/EXPOSING_CUSTOM_ENV.md
  noStore();
  return (
    <html lang="en" suppressHydrationWarning>
      <PublicRuntimeEnvProvider>
        <head>
          <Plugins hook="head" />
        </head>
        <body>
        <OverrideProvider overrides={overrides}>
          <ProgressProvider>
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
            <Plugins hook="body" />
          </ProgressProvider>
        </OverrideProvider>
        </body>
      </PublicRuntimeEnvProvider>
    </html>
  );
}
