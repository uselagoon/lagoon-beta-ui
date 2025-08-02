'use client';

import Link from 'next/link';

import { Breadcrumb } from '@uselagoon/ui-library';

export const AllDeploymentsBreadcrumbs = () => {
  const breadcrumbItems = [
    {
      key: 'alldeployments',
      title: <Link href="/alldeployments">All Deployments</Link>,
    },
  ];

  return (
    <div className="flex justify-start items-baseline">
      <Breadcrumb activeKey="alldeployments" items={breadcrumbItems} type="orgs" />
    </div>
  );
};
