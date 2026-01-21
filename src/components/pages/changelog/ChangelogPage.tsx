'use client';

import { ChangeLogContainer } from "@uselagoon/ui-library";

export default function ChangeLogPage() {
	return (
		<section>
			<div className="mb-8">
				<span className="text-xs text-gray-500 font-semibold">CHANGELOG</span>
				<h1 className="text-5xl font-semibold mt-2">What's New</h1>
			</div>
			<ChangeLogContainer sourceData="placeholder" />
		</section>
	);
}
