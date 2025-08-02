'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Breadcrumb } from '@uselagoon/ui-library';

export const BulkDeploymentsBreadcrumbs = () => {
  const { bulkId } = useParams<{ bulkId: string }>();

  const breadcrumbItems = [
    {
      key: 'bulkdeployment',
      title: <Link href={`/bulkdeployment/${bulkId}`}>Bulk Deployment</Link>,
    },
  ];

  return (
    <div className="flex justify-start items-baseline">
      <Breadcrumb activeKey="bulkdeployment" items={breadcrumbItems} type="orgs" />
    </div>
  );
};
