import React from 'react';

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion';
import { cn } from '@ui-lib/lib/utils';

type AccordionProps = React.ComponentProps<typeof Accordion> & {
	items: {
		id: string;
		trigger: React.ReactNode;
		content: React.ReactNode;
	}[];
	showArrows?: boolean;
	showSeparators?: boolean;
	secondaryText?: boolean;
};

export default function UIAccordion({
	items,
	showArrows = true,
	secondaryText = false,
	showSeparators = true,
	...rest
}: AccordionProps) {
	return (
		<Accordion {...rest}>
			{items.map((item) => (
				<AccordionItem key={item.id} value={item.id} className={cn(!showSeparators && 'border-none')}>
					<AccordionTrigger
						className={cn(
							'',
							!showArrows && '[&>svg]:hidden underline hover:no-underline',
							secondaryText && 'text-[#737373] font-normal',
						)}
					>
						{item.trigger}
					</AccordionTrigger>
					<AccordionContent className={cn('', secondaryText && 'text-[#737373] font-normal')}>
						{item.content}
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}
