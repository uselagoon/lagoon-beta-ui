import React, { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { cva } from 'class-variance-authority';
import { cn } from '@ui-lib/lib/utils';

type StatCardprops = { title: string; content: ReactNode; type?: 'default' | 'withIcon' | 'stat' };

export const cardVariants = cva('max-w-[160px] border rounded-lg flex flex-col justify-center', {
	variants: {
		type: {
			default: 'h-[108px]',
			withIcon: 'h-[125px] gap-2 p-6',
			stat: 'w-[370px] max-w-[370px] h-[140px] gap-3 p-5',
		},
	},
	defaultVariants: {
		type: 'default',
	},
});

export default function StatCard({ type = 'default', title, content }: StatCardprops) {
	return (
		<Card className={cn(cardVariants({ type }))}>
			<CardHeader>
				<CardTitle
					className={
						type === 'stat'
							? 'font-sans font-light text-sm leading-[1.4] tracking-normal'
							: 'font-sans font-medium text-sm leading-[1.5] tracking-normal'
					}
				>
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{type === 'stat' ? (
					<section className="font-sans font-normal leading-[1.75] tracking-normal">{content}</section>
				) : type === 'default' ? (
					<p className="text-2xl leading-normal font-bold ml-auto w-max">{content}</p>
				) : (
					<>{content}</>
				)}
			</CardContent>
		</Card>
	);
}
