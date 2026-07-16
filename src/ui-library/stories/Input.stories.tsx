import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { default as Input } from '../components/Input';

import { Controls, Primary, Stories, Story, Title } from '@storybook/addon-docs/blocks';

const meta: Meta<typeof Input> = {
	component: Input,
	title: 'ui-library/Input',
	tags: ['autodocs'],
	argTypes: {
		name: { control: 'text' },
		placeholder: { control: 'text' },
	},
	parameters: {
		docs: {
			page: () => (
				<>
					<Title />
					<p>Input component</p>
					<Primary />
					<Controls />
					<Stories />
				</>
			),
		},
		type: 'figspec',
		url: 'https://www.figma.com/file/iRRQQSnRmqdcoiysogtjO7/UI-v2---Master?type=design&node-id=0-15333&mode=design&t=Vm8fqTLERqbE74YW-4',
	},
};

type Story = StoryObj<typeof Input>;

export const Default: Story = {
	args: {
		placeholder: 'Some placeholder',
		label: 'Enter something',
	},
};

export const WithIcon: Story = {
	args: {
		placeholder: 'Some placeholder',
		label: 'Enter something',
		icon: <>🔎</>,
	},
};

export const WithDesc: Story = {
	args: {
		placeholder: 'Some placeholder',
		label: 'Enter something',
		description: 'This is a description',
	},
};
export default meta;
