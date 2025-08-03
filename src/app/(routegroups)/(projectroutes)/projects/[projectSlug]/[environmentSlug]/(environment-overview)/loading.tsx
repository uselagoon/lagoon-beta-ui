'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import KeyFacts from '@/components/pages/environment/_components/KeyFacts';
import { DetailStat, Skeleton } from '@uselagoon/ui-library';

export default function Loading() {
  const environmentDetailSkeletonItems = [
    {
      children: <Skeleton className="w-[60px] h-6" />,
      key: 'env_type',
      title: 'Environment type',
    },
    {
      children: <Skeleton className="w-[50px] h-6" />,
      key: 'deployment_type',
      title: 'Deployment Type',
    },
    {
      children: <Skeleton className="w-[80px] h-6" />,
      key: 'created',
      title: 'Created',
    },
    {
      children: <Skeleton className="w-[80px] h-6" />,
      key: 'updated',
      title: 'Updated',
    },
  ];

  const DetailedStats = environmentDetailSkeletonItems.map(detail => (
    <DetailStat key={detail.key} title={detail.title} value={detail.children} />
  ));

  const routeSkeletons = Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} className="w-[60%] h-6" />);

  const environmentDetails = (
    <>
      <div className="grid grid-cols-3 grid-rows-2 gap-4">{DetailedStats}</div>

      <div className="mt-6 [&>section]:flex [&>section]:gap-4">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Actions</h4>
        <Skeleton className="w-[60px]" />
      </div>
    </>
  );

  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight ">Overview</h3>
      <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
        Key information about your environment
      </span>
      <section>{environmentDetails}</section>

      <section className="mt-5 [&>*:not(:first-child)]:mb-2">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Routes</h3>
        <>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Active routes</h4>

          {routeSkeletons}
        </>
        <br />
        <>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Standby routes</h4>
          {routeSkeletons}
        </>
      </section>
    </SectionWrapper>
  );
}
