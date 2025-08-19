import { Metadata } from 'next';

import PreferencesPage from '@/components/pages/preferences/PreferencesPage';
import { PreloadQuery } from '@/lib/apolloClient';
import me from '@/lib/query/me';
import { QueryRef } from '@apollo/client';

export const metadata: Metadata = {
  title: 'Preferences',
};

type Me = {
  id: number;
  email: string;
  emailNotifications: {
    sshKeyChanges: boolean;
    groupRoleChanges: boolean;
    organizationRoleChanges: boolean;
  };
};

export interface PreferencesData {
  me: Me;
}

export default async function Preferences() {
  return (
    <PreloadQuery
      query={me}
      variables={{
        displayName: 'Me',
        fetchPolicy: 'cache-and-network',
      }}
    >
      {queryRef => <PreferencesPage queryRef={queryRef as QueryRef<PreferencesData>} />}
    </PreloadQuery>
  );
}
