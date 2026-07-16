import React from 'react';

import { Meta, StoryObj } from '@storybook/react';
import { Controls, Primary, Stories, Story, Title } from '@storybook/addon-docs/blocks';

import { Button } from '../components/ui/button';

const meta: Meta<typeof Button> = {
	component: Button,
	title: 'ui-library/Button',
	tags: ['autodocs'],
	parameters: {
		docs: {
			page: () => (
				<>
					<Title />
					<p>The main UI Button to trigger an operation.</p>
					<Primary />
					<Controls />
					<Stories />
				</>
			),
		},
	},
};

type Story = StoryObj<typeof Button>;

export const Default: Story = {
	args: {
		children: 'Retrieve',
		onClick: () => {
			alert('clicked');
		},
	},
	parameters: {
		design: {
			type: 'figspec',
			url: 'https://www.figma.com/file/iRRQQSnRmqdcoiysogtjO7/Dashboard?type=design&node-id=66-6597&mode=design&t=P00gx6yjJRZgHUuj-4',
		},
	},
};

export const Danger: Story = {
	args: {
		variant: 'destructive',
		children: 'Danger',
		onClick: () => {
			alert('clicked');
		},
	},
	parameters: {
		design: {
			type: 'figspec',
			url: 'https://www.figma.com/file/iRRQQSnRmqdcoiysogtjO7/Dashboard?type=design&node-id=66-6597&mode=design&t=P00gx6yjJRZgHUuj-4',
		},
	},
};

export const Disabled: Story = {
	args: {
		variant: 'ghost',
		disabled: true,
		children: 'Retrieve',
	},
	parameters: {
		design: {
			type: 'figspec',
			url: 'https://www.figma.com/file/iRRQQSnRmqdcoiysogtjO7/Dashboard?type=design&node-id=66-6643&mode=design&t=P00gx6yjJRZgHUuj-4',
		},
	},
};

export const ButtonLink: Story = {
	args: {
		variant: 'link',
		children: 'Button link',
	},
};

export const DisabledButtonLink: Story = {
	args: {
		disabled: true,
		variant: 'link',
		children: 'Button link',
	},
};

export default meta;
