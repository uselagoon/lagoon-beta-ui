import { Meta, StoryObj } from '@storybook/react';
import { Story } from '@storybook/addon-docs/blocks';

import { default as Switch } from '../components/Switch';

const meta: Meta<typeof Switch> = {
	component: Switch,
	title: 'ui-library/Switch',
	tags: ['autodocs'],
};

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
	args: {
		label: 'Switch Text',
		id: 'first',
		description: 'This is a switch description.',
	},
};
export const defaultChecked: Story = {
	args: {
		defaultChecked: true,
		label: 'Switch Text',
		id: 'second',
		description: 'This is a switch description.',
	},
};
export const Disabled: Story = {
	args: {
		disabled: true,
		label: 'Switch Text',
		id: 'second',
		description: 'This is a switch description.',
	},
};

export default meta;
