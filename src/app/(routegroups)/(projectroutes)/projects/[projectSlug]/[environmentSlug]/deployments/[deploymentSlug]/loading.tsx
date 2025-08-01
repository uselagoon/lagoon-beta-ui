'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import BackButton from '@/components/backButton/BackButton';
import { deploymentColumns } from '@/components/pages/deployment/DeploymentPage';
import { BasicTable, Skeleton } from '@uselagoon/ui-library';

export default function Loading() {
  const skeletonCount = 10;

  const skeletons = [...Array(skeletonCount)].map((_, index) => ({
    status: <Skeleton className="h-8 w-[200px]" />,
    name: <Skeleton className="h-8 w-[200px]" />,
    created: <Skeleton className="h-8 w-[200px]" />,
    duration: <Skeleton className="h-8 w-[200px]" />,
    actions: <Skeleton className="h-8 w-[200px]" />,
    key: `deployment-skeleton-${index}`,
  }));

  return (
    <SectionWrapper>
      <BackButton />
      <BasicTable className="border rounded-md mb-4" columns={deploymentColumns} data={skeletons} />
    </SectionWrapper>
  );
}
