'use client';

import { useOverrides } from "@/contexts/OverrideContext";
import { ChangeFeedContainer } from "@uselagoon/ui-library";


export default function ChangeFeedPage() {
	const overrides = useOverrides();
	return (
		<section>
			<div className="mb-8">
				<span className="text-xs text-gray-500 font-semibold">CHANGE FEED</span>
				<h1 className="text-5xl font-semibold mt-2">What's New</h1>
			</div>
			<ChangeFeedContainer sourceData={overrides?.components?.changeFeed?.sourceData} />
		</section>
	);
}
