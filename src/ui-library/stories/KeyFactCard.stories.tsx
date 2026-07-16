import { Meta, StoryObj } from '@storybook/react';
import { Controls, Primary, Stories, Story, Title } from '@storybook/addon-docs/blocks';

import KeyFactCard from '../components/KeyFactCard';

const meta: Meta<typeof KeyFactCard> = {
	component: KeyFactCard,
	title: 'ui-library/KeyFactCard',
	tags: ['autodocs'],
	parameters: {
		docs: {
			page: () => (
				<>
					<Title />
					<p>Keyfact card.</p>
					<Primary />
					<Controls />
					<Stories />
				</>
			),
		},
	},
};

type Story = StoryObj<typeof KeyFactCard>;

export const Default: Story = {
	args: {
		category: 'Lagoon',
		name: 'Lagoon',
		value: '20.2.2',
		img: <img src="../src/icons/lagoon.svg" className="w-[44px] h-[44px]" alt="keyfact image" />,
	},
	parameters: {
		design: {
			type: 'figspec',
			url: 'https://www.figma.com/file/iRRQQSnRmqdcoiysogtjO7/Dashboard?type=design&node-id=66-6597&mode=design&t=P00gx6yjJRZgHUuj-4',
		},
	},
};

export default meta;
