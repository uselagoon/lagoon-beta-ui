import { Check, ArrowRight, CircleAlert } from 'lucide-react';
import { Meta, StoryObj } from '@storybook/react';
import { Story } from '@storybook/addon-docs/blocks';

import { Badge } from '../components/ui/badge';

const meta: Meta<typeof Badge> = {
	component: Badge,
	title: 'ui-library/Badge',
	tags: ['autodocs'],
	args: {
		children: 'Badge',
	},
};

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
	args: {
		variant: 'default',
		children: 'Default',
	},
};

export const Secondary: Story = {
	args: {
		variant: 'secondary',
		children: 'Secondary',
	},
};

export const Destructive: Story = {
	args: {
		variant: 'destructive',
		children: 'Destructive',
	},
};

export const Outline: Story = {
	args: {
		variant: 'outline',
		children: 'Outline',
	},
};

export const WithIcon: Story = {
	name: 'With Icons',
	render: () => (
		<div className="flex flex-col gap-3">
			<Badge variant="default">
				Link
				<ArrowRight />
			</Badge>
			<Badge variant="secondary">
				<Check />
				Badge
			</Badge>
			<Badge variant="destructive">
				<CircleAlert />
				Alert
			</Badge>
			<Badge variant="outline">20+</Badge>
		</div>
	),
};

export default meta;
