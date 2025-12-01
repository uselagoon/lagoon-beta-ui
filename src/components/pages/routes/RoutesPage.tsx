'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { DataTable, SelectWithOptions } from '@uselagoon/ui-library';
import {RoutesData} from "@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/routes/page";
import {RoutesDataTableColumns} from "@/components/pages/routes/_components/RoutesDataTableColumns";
import {useQueryStates} from "nuqs";
import {resultsFilterValues} from "@/components/pages/organizations/user/_components/filterValues";
import {CreateRoute} from "@/components/createRoute/CreateRoute";


export default function RoutesPage({queryRef,	projectName,}: {
	queryRef: QueryRef<RoutesData>;
	projectName: string;
}) {
	const [{ results, route_query }, setQuery] = useQueryStates({
		results: {
			defaultValue: undefined,
			parse: (value: string | undefined) => {
				if (value == undefined || Number.isNaN(Number(value))) {
					return undefined;
				}

				const num = Number(value);

				if (num > 100) {
					return 100;
				}
				return num;
			},
		},
		route_query: {
			defaultValue: '',
			parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
		},
	});

	const setRouteQuery = (str: string) => {
		setQuery({ route_query: str });
	};

	const { refetch } = useQueryRefHandlers(queryRef);
	const { data: { projectRoutes }	} = useReadQuery(queryRef);
	return (
		<>
			<SectionWrapper>
				<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Routes</h3>
				<span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
					Manage routes for your project and environments
				</span>
				<div className="gap-4 my-2">
					<CreateRoute projectName={projectName} options={[]} environments={projectRoutes.environments} prodEnvironment={projectRoutes?.productionEnvironment} standbyEnvironment={projectRoutes?.standbyProductionEnvironment} />
				</div>
				<div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-sm">
					<p className="text-blue-800">
						<strong>Note:</strong> All changes to routes require a deployment to take effect
					</p>
				</div>
				<DataTable
					columns={RoutesDataTableColumns(projectName, projectRoutes?.environments ,refetch, projectRoutes?.productionEnvironment, projectRoutes?.standbyProductionEnvironment)}
					data={projectRoutes?.apiRoutes}
					searchableColumns={['domain']}
					onSearch={searchStr => setRouteQuery(searchStr)}
					initialSearch={route_query}
					initialPageSize={results || 10}
					renderFilters={table => (
						<div className="flex items-center justify-between">
							<SelectWithOptions
								options={resultsFilterValues}
								width={100}
								value={results === table.getRowCount() ? 'all' : String(results ?? 10)}
								placeholder="Results per page"
								onValueChange={newVal => {
									const size = newVal === 'all' ? table.getRowCount() : Number(newVal);
									table.setPageSize(size);
									setQuery({ results: size });
								}}
							/>
						</div>
					)}
				/>
			</SectionWrapper>
		</>
	);
}
