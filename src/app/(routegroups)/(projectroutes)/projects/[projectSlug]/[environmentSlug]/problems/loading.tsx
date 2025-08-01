'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import ProblemsColumns from '@/components/pages/problems/ProblemsTableColumns';
import { DataTable } from '@uselagoon/ui-library';

export default function Loading() {
  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Problems</h3>
      <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
        Problems are generated from SBOM data extracted for the underlying services and system
      </span>

      <DataTable loading data={[]} columns={ProblemsColumns()} />
    </SectionWrapper>
  );
}
