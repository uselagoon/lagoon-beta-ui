'use client';

import { capitalize, handleSort, makeSafe, renderSortIcons } from '@/components/utils';
import {Button, DataTableColumnDef, Badge, Tooltip, TooltipContent, TooltipTrigger} from '@uselagoon/ui-library';
import {Route} from "@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/routes/page";
import { DeleteRouteDialog } from '@/components/deleteRoute/DeleteRoute';
import { AttachRoute } from '@/components/addRouteToEnvironment/AttachRoute';
import { RemoveRouteFromEnvDialog } from '@/components/removeRouteFromEnvironment/RemoveRouteFromEnvironment';
import { ProjectEnvironment } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/(project-overview)/page';
import Link from 'next/link';
import { dateRangeFilter } from 'utils/tableDateRangeFilter';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import {getBadgeEnvVariant, getBadgeRouteVariant} from "../../../../../utils/setBadgeStatus"
import { EditRoute } from './EditRoute';

dayjs.extend(isBetween);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);

export const RoutesDataTableColumns = (projectName: string, environments: ProjectEnvironment[], refetch: () => void, productionEnvironment?: string, standbyEnvironment?: string) =>
[
	{
		accessorKey: 'domain',
		width: '40%',
		header: ({ column }) => {
			const sortDirection = column.getIsSorted();
			return (
				<Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
					Domain
					<div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
				</Button>
			);
		},
		cell: ({ row }) => {
			const { domain, primary, type, source} = row.original;
			let typeBadge
			if (type === "ACTIVE" || type === "STANDBY") {
				typeBadge = <Badge className="ml-2" variant={getBadgeRouteVariant(type.toLowerCase())}>{capitalize(type.toLowerCase())}</Badge>
			}
			let primaryBadge
			if (primary) {
				primaryBadge = <Badge className="ml-2" variant={getBadgeRouteVariant('primary')}>Primary</Badge>
			}
			return <div className="ml-2">
				<div><Link target="_blank" href={`https://${domain}`}>{domain}</Link></div>
				<div><Badge variant={getBadgeRouteVariant(source.toLowerCase())}>{source}</Badge>{typeBadge}{primaryBadge}</div>
				</div>;
		},
	},
	{
		accessorFn: (row) => row.environment?.name,
		id: 'environment',
		header: ({ column }) => {
			const sortDirection = column.getIsSorted();
			return (
				<Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
					Environment
					<div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
				</Button>
			);
		},
		width: '20%',
		cell: ({ row }) => {
			const { environment } = row.original;
			if (environment?.kubernetesNamespaceName) {
				const activeEnvironment =
					productionEnvironment &&
					standbyEnvironment &&
					productionEnvironment == makeSafe(environment.name);
				const standbyProdEnvironment =
					productionEnvironment &&
					standbyEnvironment &&
					standbyEnvironment == makeSafe(environment.name);

				const envType = activeEnvironment
					? 'active production'
					: standbyProdEnvironment
					? 'standby production'
					: environment.environmentType;
				const badge = <Badge variant={getBadgeEnvVariant(envType)}>{capitalize(envType)}</Badge>

				return <div className="ml-2">
					<div><Link href={`/projects/${projectName}/${environment?.kubernetesNamespaceName}`}>{environment?.name}</Link></div>
					<div>{badge}</div>
				</div>;
			}
		},
	},
	{
		accessorFn: (row) => row.environment?.name,
		id: 'service',
		header: ({ column }) => {
			const sortDirection = column.getIsSorted();
			return (
				<Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
					Service
					<div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
				</Button>
			);
		},
		cell: ({ row }) => {
			const { environment, service } = row.original;
			if (environment?.kubernetesNamespaceName) {
				return <div className="ml-2">{service}</div>;
			}
		},
	},
	{
		accessorKey: 'created',
		width: '15%',
		header: ({ column }) => {
			const sortDirection = column.getIsSorted();
			return (
				<Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
					Created
					<div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
				</Button>
			);
		},
		filterFn: dateRangeFilter,
		cell: ({ row }) => {
			const { created } = row.original;

			return created ? (
				<div className="ml-2">
					<Tooltip>
						<TooltipTrigger>{dayjs.utc(created).local().fromNow()}</TooltipTrigger>
						<TooltipContent>{dayjs.utc(created).local().format('YYYY-MM-DD HH:mm:ss')}</TooltipContent>
					</Tooltip>
				</div>
			) : (
				'-'
			);
		},
    },
	{
		accessorKey: 'updated',
		width: '15%',
		header: ({ column }) => {
			const sortDirection = column.getIsSorted();
			return (
				<Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
					Updated
					<div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
				</Button>
			);
		},
		filterFn: dateRangeFilter,
		cell: ({ row }) => {
			const { updated } = row.original;

			return updated ? (
				<div className="ml-2">
					<Tooltip>
						<TooltipTrigger>{dayjs.utc(updated).local().fromNow()}</TooltipTrigger>
						<TooltipContent>{dayjs.utc(updated).local().format('YYYY-MM-DD HH:mm:ss')}</TooltipContent>
					</Tooltip>
				</div>
			) : (
				'-'
			);
		},
    },
	{
		id: 'actions',
		width: '18%',
		header: () => <div className="text-right mr-4">Actions</div>,
		cell: ({ row }) => {
			return (
				// TODO
				<div className="flex gap-2 justify-end items-center">
					{ row.original.source === "API" ?
						// only api routes can be modified directly by users
						// lagoon yaml and autogenerated will be handled by lagoon itself
						(row.original.environment?.name ?
							<>
								<EditRoute domainName={row.original.domain} projectName={projectName} service={row.original?.service} routeType={row.original.type} primary={row.original.primary} iconOnly environmentName={row.original.environment.name} standbyEnvironment={standbyEnvironment} />
								<RemoveRouteFromEnvDialog domainName={row.original.domain} environmentName={row.original.environment.name} projectName={projectName} refetch={refetch} iconOnly/>
							</> :
							<AttachRoute domainName={row.original.domain} projectName={projectName} iconOnly environments={environments} prodEnvironment={productionEnvironment} standbyEnvironment={standbyEnvironment}/>
						)
						: (
						// yaml routes can be edited, editing a yaml route will make it an api route
						row.original.environment?.name && row.original.source === "YAML" ?
							<EditRoute domainName={row.original.domain} projectName={projectName} service={row.original?.service} routeType={row.original.type} primary={row.original.primary} iconOnly environmentName={row.original.environment.name} standbyEnvironment={standbyEnvironment} />
						: '')
					}
					{
						// only api routes can be deleted by users, the API will return an error if a user did this
						// just no need to show the button otherwise
						row.original.source === "API" ?
							<DeleteRouteDialog route={row.original} projectName={projectName} refetch={refetch} />
						: ''
					}
				</div>
			);
		},
	},
] as DataTableColumnDef<Route>[];
