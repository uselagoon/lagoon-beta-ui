import React, { ReactElement } from 'react';
import StatCard from '../StatCard';

type KeyFactProps = { name: string; category: string; value: string; img: ReactElement<HTMLImageElement> };

export default function KeyFactCard({ name, category, value, img }: KeyFactProps) {
	const KeyFactContent = (
		<section className="flex-row justify-items-end font-sans font-normal text-xs leading-[1.25] tracking-normal text-right">
			{img}
			<span className="name">{name}</span>
			<br />
			<span className="value">{value}</span>
		</section>
	);

	return <StatCard type="withIcon" title={category} content={KeyFactContent} />;
}
