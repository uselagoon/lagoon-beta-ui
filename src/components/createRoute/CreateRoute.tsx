import { FC } from 'react';

import AddRouteSheet from "@/components/createRoute/_components/AddRouteSheet";
import { ProjectEnvironment } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/(project-overview)/page';

interface Props {
	projectName: string;
	environmentName?: string;
	options: {
		label: string;
		value: number;
	}[];
	variant?: 'default' | 'small';
	refetch?: () => void;
	environments?: ProjectEnvironment[];
	prodEnvironment?: string;
	standbyEnvironment?: string;
}
export const CreateRoute: FC<Props> = ({ projectName, environmentName, refetch, variant = 'default', environments, prodEnvironment, standbyEnvironment }) => {
	return (
		<>
			<div className="flex gap-2 items-center">
				<span className="text mr-4">Define a new Route</span>
				<AddRouteSheet projectName={projectName} environments={environments} environmentName={environmentName} prodEnvironment={prodEnvironment} standbyEnvironment={standbyEnvironment}/>
			</div>
		</>
	);
};
