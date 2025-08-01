'use client';

import Link from 'next/link';

import { Breadcrumb, Input } from '@uselagoon/ui-library';

export const AllDeploymentsBreadcrumbs = () => {
  const breadcrumbItems = [
    {
      key: 'alldeployments',
      title: <Link href="/alldeployments">All Deployments</Link>,
    },
  ];

  return (
    <div className="flex justify-between items-baseline">
      <Breadcrumb activeKey="alldeployments" items={breadcrumbItems} type="orgs" />
      <Input className="-translate-y-6" placeholder="Search" label="" />
    </div>
  );
};
