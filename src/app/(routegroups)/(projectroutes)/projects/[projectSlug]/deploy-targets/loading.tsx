'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { BasicTable, Skeleton } from '@uselagoon/ui-library';

export default function Loading() {
  const deployTargetColumns = [
    {
      title: 'Deploy Target Name',
      dataIndex: 'name',
      key: 'deploy_target_name',
    },
    {
      title: 'Branches Enabled ',
      dataIndex: 'branches',
      key: 'branches_enabled',
    },

    {
      title: 'Pull Requests Enabled',
      key: 'pull_requests_enabled',
      dataIndex: 'pullRequests',
    },
  ];

  const skeletonCount = 10;

  const skeletons = [...Array(skeletonCount)].map((_, index) => ({
    key: `deploy-target-skeleton-${index}`,
    name: <Skeleton className="h-8 w-[200px]" />,
    branches: <Skeleton className="h-8 w-[200px]" />,
    pullRequests: <Skeleton className="h-8 w-[200px]" />,
  }));

  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-5">Deploy targets</h3>
      <div className="rounded-md border">
        <BasicTable columns={deployTargetColumns} data={skeletons} />
      </div>
    </SectionWrapper>
  );
}
