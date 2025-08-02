'use client';

import React from 'react';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { DataTable } from '@uselagoon/ui-library';

export default function Loading() {
  return (
    <>
      <SectionWrapper>
        <header>Groups</header>
        <DataTable columns={[]} data={[]} />
      </SectionWrapper>
    </>
  );
}
