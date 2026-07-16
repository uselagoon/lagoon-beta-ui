import { cva } from 'class-variance-authority';
import { HTMLAttributes } from 'react';
import { cn } from '@ui-lib/lib/utils';

const avatarBubble = cva('rounded-full h-6 w-6 min-w-[24px] flex justify-center items-center mr-2 text-xs');

type AvatarBubbleProps = HTMLAttributes<HTMLDivElement> & {
	bgColor: string;
	textColor: string;
};

export default function AvatarBubble({ bgColor, textColor, className, children, ...props }: AvatarBubbleProps) {
	return (
		<div {...props} className={cn(avatarBubble(), className)} style={{ backgroundColor: bgColor, color: textColor }}>
			{children}
		</div>
	);
}
