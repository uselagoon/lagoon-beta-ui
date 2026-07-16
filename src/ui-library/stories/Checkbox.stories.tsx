import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { default as Checkbox } from '../components/Checkbox';
import { Story } from '@storybook/addon-docs/blocks';

const meta: Meta<typeof Checkbox> = {
	component: Checkbox,
	title: 'ui-library/Checkbox',
	tags: ['autodocs'],
	parameters: {
		design: {
			type: 'figspec',
			url: 'https://www.figma.com/file/iRRQQSnRmqdcoiysogtjO7/UI-v2---Master?type=design&node-id=85-7295&mode=design&t=Vm8fqTLERqbE74YW-4',
		},
	},
};

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
	args: {
		label: 'Check the box',
		id: 'first',
	},
};
export const Disabled: Story = {
	args: {
		disabled: true,
		label: "You don't have the cards ",
		id: 'second',
	},
};

export default meta;
