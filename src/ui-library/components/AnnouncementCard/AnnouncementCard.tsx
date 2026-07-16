import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@ui-lib/components/ui/card';
import { BotMessageSquare, X } from 'lucide-react';
import { cn } from '@ui-lib/lib/utils';
import { getLocalStorage, setLocalStorage } from '@ui-lib/_util/helpers';

export type AnnouncementCardProps = {
	title?: string;
	description?: string;
	ctaText?: string;
	ctaUrl?: string;
	openInNewTab?: boolean;
	onClose?: () => void;
	className?: string;
	defaultLogo?: boolean;
	disabled?: boolean;
};

export default function AnnouncementCard({
	title = "Latest Changes",
	description,
	ctaText = "See What's New",
	ctaUrl = 'https://docs.lagoon.sh/releases/2.30.0/', // hardcoded for now, need a way to make this dynamic in the future
	openInNewTab = true,
	onClose,
	className = '[background:#dae8fd] ![color:#387eda] [box-shadow:var(--badge-ring)]',
	defaultLogo = false,
	disabled = false
}: AnnouncementCardProps) {
	const [isVisible, setIsVisible] = useState(getLocalStorage('promo-card-dismissed') !== true);

	const handleClose = () => {
		setIsVisible(false);
		onClose?.();
		setLocalStorage('promo-card-dismissed', true, 30);
	};

	if (!isVisible || disabled) {
		return null;
	}

	return (
		<Card className={cn('m-2 w-auto bg-[#737373]/20 gap-0  !p-4', className)}>
			<button
				onClick={handleClose}
				className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
				aria-label="Close announcement"
			>
				<X className="h-4 w-4" />
			</button>
			<CardHeader className="relative pb-0 !px-3">
				<div className="flex flex-row items-center gap-2">
					{defaultLogo && <BotMessageSquare className="h-5 w-5 flex-shrink-0" />}
					{title && <p className="text-sm font-bold leading-[1.4]">{title}</p>}
				</div>
			</CardHeader>
			<CardContent className={`!px-3 ${description ? 'pt-2 space-y-2' : ''}`}>
				<p className="text-sm font-normal leading-[1.4]">
					{description}
				</p>
				<a
					href={ctaUrl}
					target={openInNewTab ? '_blank' : undefined}
					rel={openInNewTab ? 'noopener noreferrer' : undefined}
					className="text-sm font-normal underline hover:no-underline promo-link__ai"
				>
					{ctaText}
				</a>
			</CardContent>
		</Card>
	);
}
