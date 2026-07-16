import { Meta, StoryObj } from '@storybook/react';
import { Controls, Primary, Stories, Story, Title } from '@storybook/addon-docs/blocks';

import Notification from '../components/Notification';
import { Button } from '../components/ui/button';

const meta: Meta<typeof Notification> = {
	component: Notification,
	title: 'ui-library/Notification',
	tags: ['autodocs'],
	parameters: {
		docs: {
			page: () => (
				<>
					<Title />
					<p>Notification - either triggered manually or by a child component click</p>
					<Primary />
					<Controls />
					<Stories />
				</>
			),
		},
	},
};

type Story = StoryObj<typeof Notification>;

export const Default: Story = {
	args: {
		title: 'Proceed?',
		message: 'This is a notification',
		children: <Button>Click to trigger</Button>,
	},
	parameters: {
		design: {
			type: 'figspec',
			url: 'https://www.figma.com/file/iRRQQSnRmqdcoiysogtjO7/Dashboard?type=design&node-id=66-6597&mode=design&t=P00gx6yjJRZgHUuj-4',
		},
	},
};

export default meta;
