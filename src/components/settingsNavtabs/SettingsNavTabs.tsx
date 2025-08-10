'use client';

import { ReactNode } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { TabNavigation } from '@uselagoon/ui-library';

export const SettingsNavTabs = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <section className="flex flex-col gap-4">
      <TabNavigation
        pathname={pathname}
        items={[
          {
            key: 'ssh',
            label: <Link href={`/settings`}>SSH Keys</Link>,
          },
          {
            key: 'preferences',
            label: <Link href={`/settings/preferences`}>Preferences</Link>,
          },
        ]}
      />
      {children}
    </section>
  );
};

export default SettingsNavTabs;
