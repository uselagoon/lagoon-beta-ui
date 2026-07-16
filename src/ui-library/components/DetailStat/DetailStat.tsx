import React, { isValidElement, ReactNode } from 'react';
import StatCard from '../StatCard';
import { cva } from 'class-variance-authority';

type StatProps = {
	title: string;
	value: ReactNode;
	fullWidth?: boolean;
	lowercaseValue?: boolean;
	capitalizeValue?: boolean;
};

const valueText = cva('font-sans font-normal text-lg leading-normal tracking-normal text-right', {
	variants: {
		transform: {
			lowercase: 'lowercase',
			capitalize: 'capitalize',
			none: '',
		},
	},
	defaultVariants: {
		transform: 'none',
	},
});

function formatToCypressString(input: string) {
	return input.toLowerCase().replace(/\s+/g, '-');
}

const DetailStat: React.FC<StatProps> = ({ title, value, lowercaseValue, capitalizeValue }) => {
	const isElement = isValidElement(value);

	let textTransform = '';
	if (lowercaseValue) textTransform = 'lowercase';
	if (capitalizeValue) textTransform = 'capitalize';

	const content = isElement ? (
		<div className={textTransform} data-cy={formatToCypressString(title)}>
			{value}
		</div>
	) : (
		<span
			className={valueText({
				transform: lowercaseValue ? 'lowercase' : capitalizeValue ? 'capitalize' : 'none',
			})}
			data-cy={formatToCypressString(title)}
		>
			{value}
		</span>
	);

	return <StatCard type="stat" title={title} content={content} />;
};

export default DetailStat;
export type { StatProps };
