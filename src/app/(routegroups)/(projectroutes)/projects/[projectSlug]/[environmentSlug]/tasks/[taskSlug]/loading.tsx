'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import BackButton from '@/components/backButton/BackButton';
import { taskColumns } from '@/components/pages/task/TaskPage';
import { BasicTable, DataTable, Skeleton } from '@/ui-library';

export default function Loading() {
  const skeletonCount = 10;

  const skeletons = [...Array(skeletonCount)].map((_, index) => ({
    name: <Skeleton className="h-8 w-[200px]" />,
    service: <Skeleton className="h-8 w-[200px]" />,
    created: <Skeleton className="h-8 w-[200px]" />,
    duration: <Skeleton className="h-8 w-[200px]" />,
    status: <Skeleton className="h-8 w-[200px]" />,
    actions: <Skeleton className="h-8 w-[200px]" />,
    key: `task-skeleton-${index}`,
  }));

  return (
    <SectionWrapper>
      <BackButton />
      <DataTable columns={taskColumns} data={[]} disableExtra />
    </SectionWrapper>
  );
}
