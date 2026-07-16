import React from 'react';
import { Frown, Meh, Smile, HelpCircle } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@ui-lib/components/ui/hover-card';

import StatCard from '../StatCard';

type LagoonProblemsOverviewProps = {
	problems: number;
	critical: number;
	high: number;
	medium: number;
	low: number;
	skeleton?: false;
};
type Props =
	| LagoonProblemsOverviewProps
	| {
		skeleton: true;
	};

const LagoonProblemsOverview: React.FC<Props> = (props) => {
	if (props.skeleton) {
		return (
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 animate-pulse">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="h-[80px] rounded-xl bg-muted" />
				))}
			</div>
		);
	}

	const { problems, critical, high, medium, low } = props;

	const getStatusIcon = () => {
		if (critical >= 1) return <Frown className="h-6 w-6 text-rose-500" />;
		if (high >= 1) return <Meh className="h-6 w-6 text-orange-500" />;
		if (medium >= 1 || low >= 1) return <Smile className="h-6 w-6 text-green-500" />;

		return <Smile className="h-6 w-6 text-green-500" />;
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3 text-center mx-auto w-fit">
				<div className="shrink-0">{getStatusIcon()}</div>
				<div className="flex items-center gap-2 text-xl font-semibold">
					<h2>At a glance</h2>
					<HoverCard>
						<HoverCardTrigger asChild>
							<HelpCircle className="h-4 w-4 text-muted-foreground cursor-pointer" />
						</HoverCardTrigger>
						<HoverCardContent className="w-64 text-sm text-muted-foreground">
							The summary of all the problems is shown here.
						</HoverCardContent>
					</HoverCard>
				</div>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
				<StatCard type="default" title="Problems" content={problems} />
				<StatCard type="default" title="Critical" content={critical} />
				<StatCard type="default" title="High" content={high} />
				<StatCard type="default" title="Medium" content={medium} />
				<StatCard type="default" title="Low" content={low} />
			</div>
		</div>
	);
};

LagoonProblemsOverview.displayName = 'LagoonProblemsOverview';
export default LagoonProblemsOverview;
export type { LagoonProblemsOverviewProps };
