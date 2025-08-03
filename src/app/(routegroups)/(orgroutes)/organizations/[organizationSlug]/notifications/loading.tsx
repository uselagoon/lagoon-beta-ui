'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { AddNotification } from '@/components/pages/organizations/notifications/_components/AddNotification';
import { NotificationsDataTableColumnsLoading } from '@/components/pages/organizations/notifications/_components/NotificationsDataTableColumns';
import { DataTable } from '@uselagoon/ui-library';

export default function Loading() {
  return (
    <>
      <SectionWrapper>
        <div className="flex items-center justify-between mb-4">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Notifications</h3>
        </div>
        <div className="gap-4 my-4">
          <AddNotification orgId={0} refetch={() => {}} />
        </div>
        <DataTable loading columns={NotificationsDataTableColumnsLoading} data={[]} />
      </SectionWrapper>
    </>
  );
}
