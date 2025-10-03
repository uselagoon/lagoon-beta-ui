'use client';

import { OrganizationProjectsData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/projects/(projects-page)/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { CreateProject } from '@/components/createProject/CreateProject';
import OrganizationNotFound from '@/components/errors/OrganizationNotFound';
import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { DataTable, SelectWithOptions } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

// import { ProjectsDataTableColumns } from './_components/ProjectsDataTableColumns';
// import { RemoveProject } from './_components/RemoveProject';
// import { resultsFilterValues } from './_components/filterOptions';

// eslint-disable-next-line no-empty-pattern
export default function RoutesPage({}: object) {
	// const [{ results, project_query }, setQuery] = useQueryStates({
	// 	results: {
	// 		defaultValue: undefined,
	// 		parse: (value: string | undefined) => {
	// 			if (value == undefined || Number.isNaN(Number(value))) {
	// 				return undefined;
	// 			}
	//
	// 			const num = Number(value);
	//
	// 			if (num > 100) {
	// 				return 100;
	// 			}
	// 			return num;
	// 		},
	// 	},
	// 	project_query: {
	// 		defaultValue: '',
	// 		parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
	// 	},
	// });

	// const setResults = (val: string) => {
	// 	setQuery({ results: Number(val) });
	// };
	//
	// const setProjectQuery = (str: string) => {
	// 	setQuery({ project_query: str });
	// };
	//
	// const { refetch } = useQueryRefHandlers(queryRef);
	//
	// const {
	// 	data: { organization },
	// } = useReadQuery(queryRef);
	//
	// const refetchData = async () => {
	// 	await Promise.all([refetch()]);
	// };
	//
	// if (!organization) {
	// 	return <OrganizationNotFound orgName={organizationSlug} />;
	// }
	//
	// const deployTargetOptions = organization.deployTargets.map(deploytarget => {
	// 	return { label: deploytarget.name, value: deploytarget.id };
	// });

	return (
		<>
			<SectionWrapper>
				<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Routes</h3>
				<span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
					Custom routes to your environments
				</span>
				<div className="gap-4 my-4">
					{/*<CreateProject organizationId={organization.id} options={deployTargetOptions} />*/}
				</div>
				<DataTable
					columns={[]}
					data={[]}
					searchableColumns={['name']}
					// onSearch={searchStr => setProjectQuery(searchStr)}
					// initialSearch={project_query}
					// initialPageSize={results || 10}
					renderFilters={table => (
						<div className="flex items-center justify-between">
							<SelectWithOptions
								options={[]}
								width={100}
								// value={String(results || 10)}
								placeholder="Results per page"
								// onValueChange={newVal => {
								// 	table.setPageSize(Number(newVal));
								// 	setResults(newVal);
								// }}
							/>
						</div>
					)}
				/>
			</SectionWrapper>
		</>
	);
}
