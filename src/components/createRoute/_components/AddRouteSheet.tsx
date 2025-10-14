import React from 'react';

import addRouteToProject from '@/lib/mutation/addRouteToProject';
import { useMutation } from '@apollo/client';
import { Sheet } from '@uselagoon/ui-library';
import { toast } from 'sonner';
import { CirclePlus } from 'lucide-react';
import { isDNS1123Subdomain } from '@/components/utils';

const AddRouteSheet = ({ projectName }: { projectName: string }) => {
	const [addRouteMutation, { error, loading }] = useMutation(addRouteToProject, {
		refetchQueries: ['getProject'],
		onCompleted: _ => {
			toast.success('Route added successfully.');
		},
	});

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
			{error && (
			<div className="text-red-500 p-3 border mt-4 border-red-300 rounded-md bg-red-50">
				<strong>Error adding route:</strong> {error.message}
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
				]}
			/>
		</div>
	);
};

export default AddRouteSheet;