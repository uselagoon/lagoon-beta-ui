'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Breadcrumb, Input } from '@uselagoon/ui-library';

export const SettingsBreadcrumbs = () => {
  const breadcrumbItems = [
    {
      key: 'settings',
      title: <Link href="/settings">Settings</Link>,
    },
  ];

  return (
    <div className="flex justify-between items-baseline">
      <Breadcrumb activeKey="settings" items={breadcrumbItems} type="orgs" />
      <Input className="-translate-y-6" placeholder="Search" label="" />
    </div>
  );
};
