import React from 'react';

import addRouteToProject from '@/lib/mutation/addRouteToProject';
import { useMutation } from '@apollo/client';
import { Sheet } from '@uselagoon/ui-library';
import { toast } from 'sonner';
import { CirclePlus } from 'lucide-react';
import { isDNS1123Subdomain } from '@/components/utils';
import { ProjectEnvironment } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/(project-overview)/page';

const AddRouteSheet = (
	{
		projectName,
		environmentName,
		environments,
		prodEnvironment,
		standbyEnvironment,
	}: {
		projectName: string;
		environmentName?: string;
		environments?: ProjectEnvironment[];
		prodEnvironment?: string;
		standbyEnvironment?: string;
	}
) => {
	const [addRouteMutation, { error, loading }] = useMutation(addRouteToProject, {
		refetchQueries: ['getProject', 'getEnvironment'],
		onCompleted: _ => {
			toast.success('Route added successfully.');
		},
	});

	const handleAddRoute = async (e: React.MouseEvent<HTMLButtonElement>, values: any) => {
		try {
			const { domain, service, environment } = values;

			await addRouteMutation({
				variables: {
					input: {
						project: projectName,
						domain: domain,
						environment: environment,
						service: service,
					},
				},
			});
		} catch (err) {
			console.error('Error adding route:', err);
			return false;
		}
	};

	const options = environments?.map(env => ({
		label: (env.name == standbyEnvironment ? (env.name + " (standby)") : (env.name == prodEnvironment ? (env.name + " (production)") : (env.name))),
		value: env.name,
	}));


	const customRouteInfo =
		<>
			<div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-sm">
			<p className="text-blue-800">
				<strong>Note:</strong> Only one route can be the primary route per environment, if one is already set,
				then the existing primary route will be unset.
			</p>
			</div>
			{error && (
			<div className="text-red-500 p-3 mt-2 border border-red-300 rounded-md bg-red-50">
				<strong>Error updating route:</strong> {error.message}
			</div>
			)}
		</>;

	return (
		<div className="space-y-4">
			<Sheet
				sheetTrigger={<><CirclePlus className="h-5 w-5" /> Create Route</>}
				sheetTitle="Create a custom route"
				sheetDescription="Point a route from a domain you manage to an environment."
				sheetFooterButton="Create"
				loading={loading}
				buttonAction={handleAddRoute}
				additionalContent={customRouteInfo}
				error={!!error}
				sheetFields={[
					{
						id: 'domain',
						label: 'Custom Domain',
						type: 'text',
						placeholder: 'e.g., example.com',
						required: true,
						validate: value => {
							const domain = value as string;
							if (!isDNS1123Subdomain(domain)) {
								return 'Is not a valid domain name';
							}
							return null;
						},
					},
					{
						id: 'environment',
						label: 'Name of the environment',
						type: environmentName ? 'text' : 'select',
						placeholder: 'Select environment',
						options: options,
						required: environmentName ? true : false,
						readOnly: environmentName ? true : false,
						inputDefault: environmentName,
					},
					{
						id: 'service',
						label: 'Name of the service to attach to',
						type: 'text',
						required: environmentName ? true : false,
						placeholder: 'Enter service name',
					},
				]}
			/>
		</div>
	);
};

export default AddRouteSheet;