import React, { FC } from 'react';
import {
	Dialog,
	DialogTrigger,
	Button,
	DialogContent,
	DialogHeader,
	DialogTitle, DialogDescription
} from "@uselagoon/ui-library";
import {
	DeployTarget
} from "@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/(organization-overview)/page";

interface ViewDeployTargetsProps {
	deployTargetsNo: number;
	data: DeployTarget[];
}
// TODO: Create Dialog Component in UI Library
export const ViewDeployTargets: FC<ViewDeployTargetsProps> = ({deployTargetsNo, data}) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<span className="cursor-pointer">{`... and ${deployTargetsNo} more`}</span>
			</DialogTrigger>
			<DialogContent className="max-w-xs w-1/4">
				<DialogHeader>
					<DialogTitle className="mb-2">Available Deploy Targets</DialogTitle>
					<DialogDescription>
						{data.map((deployTarget) => (
							<div key={deployTarget.id} className="mb-2">
								<strong>{deployTarget.name}</strong>
							</div>
						))}
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}

export default ViewDeployTargets;