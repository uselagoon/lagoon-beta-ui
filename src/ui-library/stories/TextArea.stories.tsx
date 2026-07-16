import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { default as Textarea } from '../components/TextArea';

import { Controls, Primary, Stories, Story, Title } from '@storybook/addon-docs/blocks';

const meta: Meta<typeof Textarea> = {
	component: Textarea,
	title: 'ui-library/Textarea',
	tags: ['autodocs'],
	argTypes: {
		name: { control: 'text' },
		placeholder: { control: 'text' },
		rows: { control: 'number' },
		cols: { control: 'number' },
	},
	parameters: {
		docs: {
			page: () => (
				<>
					<Title />
					<p>Textarea component for multi-line text input</p>
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

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
	args: {
		placeholder: 'Enter your text here...',
		label: 'Description',
		rows: 4,
	},
};

export default meta;
