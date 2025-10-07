import React from 'react';

import addRouteToProject from '@/lib/mutation/addRouteToProject';
import { useMutation } from '@apollo/client';
import { Sheet } from '@uselagoon/ui-library';
import { toast } from 'sonner';

const AddRouteSheet = ({ projectName }: { projectName: string }) => {
	const [addRouteMutation, { error, loading }] = useMutation(addRouteToProject, {
		refetchQueries: ['getProject'],
		onCompleted: _ => {
			toast.success('Route added successfully.');
		},
	});

	const hasSpaces = (str: string) => str?.indexOf(' ') > 0;
	const handleAddRoute = async (e: React.MouseEvent<HTMLButtonElement>, values: any) => {
		try {
			const { domain } = values;

			await addRouteMutation({
				variables: {
					input: {
						project: projectName,
						domain: domain,
					},
				},
			});
		} catch (err) {
			console.error('Error adding route:', err);
			return false;
		}
	};

	const customRouteInfo =
		<>
			<div className="mt-4 p-4 text-sm">
				<div className="mb-2">
					<a
						rel="noopener noreferrer"
						href="#"
						className="underline hover:text-blue-900"
					>
						Learn more about custom routing
					</a>{' '}
				</div>
				<p>We will verify these settings once you click create, time to live will vary depending on your host.</p>
			</div>
			{error && (
			<div className="text-red-500 p-3 border mt-4 border-red-300 rounded-md bg-red-50">
				<strong>Error adding route:</strong> {error.message}
			</div>
			)}
		</>;

	return (
		<div className="space-y-4">
			<Sheet
				sheetTrigger="Create Route"
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
							if (hasSpaces(domain)) {
								return 'Domain cannot contain spaces';
							}
							return null;
						},
					},
				]}
			/>
		</div>
	);
};

export default AddRouteSheet;