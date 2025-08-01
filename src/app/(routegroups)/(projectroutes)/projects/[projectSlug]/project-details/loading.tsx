'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { DetailStat, Skeleton } from '@uselagoon/ui-library';

// import { DetailedStats, LoadingSkeleton } from '@uselagoon/ui-library';

export default function Loading() {
  const detailItems = [
    {
      key: 'created',
      title: 'CREATED',
      children: <Skeleton className="w-[250px] h-8" />,
    },
    {
      key: 'origin',
      title: 'ORIGIN',
      children: <Skeleton className="w-[250px] h-8" />,
    },
    {
      key: 'giturl',
      title: 'GIT URL',
      children: <Skeleton className="w-[250px] h-8" />,
    },
    {
      key: 'branches',
      title: 'BRANCHES ENABLED',
      children: <Skeleton className="w-[250px] h-8" />,
    },
    {
      key: 'pulls',
      title: 'PULL REQUESTS ENABLED',
      children: <Skeleton className="w-[50px] h-8" />,
    },
    {
      key: 'dev_envs',
      title: 'DEVELOPMENT ENVIRONMENTS IN USE',
      children: <Skeleton className="w-[50px] h-8" />,
    },
  ];

  const DetailedStats = detailItems.map(detail => (
    <DetailStat key={detail.key} title={detail.title} value={detail.children} />
  ));

  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Details</h3>
      <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
        Key information about your project
      </span>

      <div className="grid grid-cols-3 grid-rows-3 gap-4">{DetailedStats}</div>
    </SectionWrapper>
  );
}
