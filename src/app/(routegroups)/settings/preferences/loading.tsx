'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { Button, Skeleton } from '@uselagoon/ui-library';

export default function Loading() {
  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Email preferences</h3>
      <div className="flex flex-wrap gap-y-4 my-6">
        {[1, 2, 3].map((_, idx) => (
          <div key={`${idx}-preference-option`} className="basis-6/12 min-w-max mb-4">
            <div className="flex items-start gap-1">
              <Skeleton className="h-17 w-100" />
            </div>
          </div>
        ))}
      </div>
      <Button disabled>Update Preferences</Button>
    </SectionWrapper>
  );
}
