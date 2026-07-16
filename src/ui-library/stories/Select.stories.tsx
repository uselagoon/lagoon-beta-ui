import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { default as Select } from '../components/Select';
import { Controls, Primary, Stories, Story, Title } from '@storybook/addon-docs/blocks';

const meta: Meta<typeof Select> = {
	component: Select,
	title: 'ui-library/Select',
	tags: ['autodocs'],
	parameters: {
		docs: {
			page: () => (
				<>
					<Title />
					<p>Select from given options</p>
					<Primary />
					<Controls />
					<Stories />
				</>
			),
		},
		design: {
			type: 'figspec',
			url: 'https://www.figma.com/file/iRRQQSnRmqdcoiysogtjO7/UI-v2---Master?type=design&node-id=85-7312&mode=design&t=Vm8fqTLERqbE74YW-4',
		},
	},
};

type Story = StoryObj<typeof Select>;

export const Default: Story = {
	args: {
		placeholder: 'Select an option',
		options: [
			{ value: '1', label: 'Select option #1' },
			{ value: '2', label: 'Select option #2' },
			{ value: '3', label: 'Select option #3' },
		],
	},
};

export const WithGroupLabels: Story = {
	args: {
		placeholder: 'Select an option',
		options: [
			{
				label: 'Fruits',
				options: [
					{ label: 'Apple', value: 'apple' },
					{ label: 'Banana', value: 'banana' },
				],
			},
			{
				label: 'Vegetables',
				options: [
					{ label: 'Carrot', value: 'carrot' },
					{ label: 'Lettuce', value: 'lettuce' },
				],
			},
		],
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		placeholder: 'Cannot select anything',
	},
};

export const NoOptions: Story = {
	args: {
		options: [],
		placeholder: 'Empty',
	},
};

export default meta;
