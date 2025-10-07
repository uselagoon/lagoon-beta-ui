import { FC } from 'react';

import AddRouteSheet from "@/components/createRoute/_components/AddRouteSheet";

interface Props {
	projectName: string;
	options: {
		label: string;
		value: number;
	}[];
	variant?: 'default' | 'small';
	refetch?: () => void;
}
export const CreateRoute: FC<Props> = ({ projectName, refetch, variant = 'default' }) => {
	return (
		<>
			<div className="flex gap-2 items-center">
				<span className="text mr-4">Define a new Route</span>
				<AddRouteSheet projectName={projectName} />
			</div>
		</>
	);
};
