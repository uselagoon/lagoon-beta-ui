'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { DataTable } from '@uselagoon/ui-library';
import {CreateRoute} from "@/components/createRoute/CreateRoute";
import {RoutesDataTableColumns} from "@/components/pages/routes/_components/RoutesDataTableColumns";

export default function Loading() {
	return (
		<SectionWrapper>
			<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Routes</h3>
			<span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
					Manage routes for your project and environments
				</span>
			<div className="gap-4 my-2">
				<CreateRoute projectName={''} options={[]} environments={[]} prodEnvironment={''} standbyEnvironment={''} />
			</div>
			<div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-sm">
				<p className="text-blue-800">
					<strong>Note:</strong> All changes to routes require a deployment to take effect
				</p>
			</div>
			<DataTable loading columns={RoutesDataTableColumns('', [], () => {}, '', '')} data={[]} />
		</SectionWrapper>
	);
}
