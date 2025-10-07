'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { FactsTableColumns, InsightsTableColumns } from '@/components/pages/insights/DataTableColumns';
import { DataTable } from '@uselagoon/ui-library';

export default function Loading() {
	return (
		<SectionWrapper>
			<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Facts</h3>
			<DataTable loading columns={[]} data={[]} />

			<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight my-4">Facts</h3>

			<DataTable loading columns={InsightsTableColumns(0)} data={[]} />
		</SectionWrapper>
	);
}
