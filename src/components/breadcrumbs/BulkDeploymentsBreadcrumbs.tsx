'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Breadcrumb, Input } from '@uselagoon/ui-library';

export const BulkDeploymentsBreadcrumbs = () => {
  const { bulkId } = useParams<{ bulkId: string }>();

  const breadcrumbItems = [
    {
      key: 'bulkdeployment',
      title: <Link href={`/bulkdeployment/${bulkId}`}>Bulk Deployment</Link>,
    },
  ];

  return (
    <div className="flex justify-between items-baseline">
      <Breadcrumb activeKey="bulkdeployment" items={breadcrumbItems} type="orgs" />
      <Input className="-translate-y-6" placeholder="Search" label="" />
    </div>
  );
};
