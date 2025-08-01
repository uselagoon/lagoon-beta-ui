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
            key: 'settings',
            label: <Link href={`/settings`}>SSH Keys</Link>,
          },
        ]}
      />
      {children}
    </section>
  );
};

export default SettingsNavTabs;
