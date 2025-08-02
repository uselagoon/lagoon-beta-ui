'use client';

import Link from 'next/link';

import { Breadcrumb } from '@uselagoon/ui-library';

export const SettingsBreadcrumbs = () => {
  const breadcrumbItems = [
    {
      key: 'settings',
      title: <Link href="/settings">Settings</Link>,
    },
  ];

  return (
    <div className="flex justify-start items-baseline">
      <Breadcrumb activeKey="settings" items={breadcrumbItems} type="orgs" />
    </div>
  );
};
