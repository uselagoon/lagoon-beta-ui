'use client';

import React, { FC, Fragment, MouseEventHandler, ReactElement, ReactNode } from 'react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbLink,
	BreadcrumbSeparator,
} from '@ui-lib/components/ui/breadcrumb';
import CopyToClipboard from '../CopyToClipboard';
import { ChevronRight } from 'lucide-react';

type LinkComponent = ReactElement<React.AnchorHTMLAttributes<HTMLAnchorElement>>;

const decorators = {
	default: ['', 'project', 'environment'],
	orgs: ['', 'organization', 'project'],
};

export interface BasicProps {
	items: (
		| {
				title: string | ReactNode;
				navOnClick?: MouseEventHandler<HTMLAnchorElement | HTMLSpanElement>;
				key?: string | number;
				copyText?: string;
			}
		| {
				title: LinkComponent;
				key?: string | number;
				copyText?: string;
			}
	)[];
	activeKey?: string | number;
}

export type UIBreadcrumbProps = BasicProps &
	({ type: 'default'; currentSlug?: never } | { type: 'orgs'; currentSlug?: 'project' | 'user' | 'group' });

const UIBreadcrumb: FC<UIBreadcrumbProps> = ({ activeKey, items, type, currentSlug }) => {
	const decoratorList = type && ['default', 'orgs'].includes(type) ? [...decorators[type]] : null;
	if (currentSlug && decoratorList) {
		decoratorList[2] = currentSlug;
	}

	return (
		<Breadcrumb className="mb-8 text-sm" data-cy="page-title">
			<BreadcrumbList>
				{items.map((item, idx) => {
					const key = 'key' in item ? item.key : idx;
					const isActive = activeKey && activeKey === key;
					const titleDecorator = decoratorList?.[idx] ?? null;
					const shouldCopy = 'copyText' in item && item.copyText && titleDecorator;
					const isSmall = item.copyText && item.copyText.length < 15;
					const decorator = isSmall && titleDecorator === 'organization' ? 'Org' : titleDecorator;

					const content = (
						<div className="relative flex flex-col items-start group">
							{decorator && (
								<span className="absolute -top-3 left-0 text-[11px] font-semibold uppercase text-primary pointer-events-none select-none">
									{decorator}
								</span>
							)}
							<div className="flex items-center gap-1">
								<span className={isActive ? 'text-foreground' : 'text-muted-foreground'}>
									{'navOnClick' in item && item.navOnClick ? (
										<span onClick={item.navOnClick} className="hover:underline cursor-pointer">
											{item.title}
										</span>
									) : (
										item.title
									)}
								</span>
								{shouldCopy && (
									<div className="text-primary scale-90 ml-1">
										<CopyToClipboard text={item.copyText!} iconOnly />
									</div>
								)}
							</div>
						</div>
					);

					return (
						<Fragment key={key}>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>{content}</BreadcrumbLink>
							</BreadcrumbItem>
							{idx !== items.length - 1 && (
								<BreadcrumbSeparator>
									<ChevronRight className="w-4 h-4 text-muted-foreground" />
								</BreadcrumbSeparator>
							)}
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

UIBreadcrumb.displayName = 'Breadcrumb';
export default UIBreadcrumb;
