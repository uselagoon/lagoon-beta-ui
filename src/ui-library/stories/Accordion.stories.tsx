import { Meta, StoryObj } from '@storybook/react';
import { Story } from '@storybook/addon-docs/blocks';
import { default as Accordion } from '../components/Accordion';

const meta: Meta<typeof Accordion> = {
	component: Accordion,
	title: 'ui-library/Accordion',
	tags: ['autodocs'],
};

type Story = StoryObj<typeof Accordion>;

const accordionItems = [
	{
		id: '1',
		trigger: 'Is it accessible?',
		content: 'Yes. It adheres to the WAI-ARIA design pattern.',
	},
	{
		id: '2',
		trigger: 'Product Specifications',
		content: "Yes. It's unstyled by default, giving you freedom over the look and feel.",
	},
	{
		id: '3',
		trigger: 'Can it be animated?',
		content: 'Yes! You can animate the Accordion with CSS or JavaScript.',
	},
	{
		id: '4',
		trigger:
			'What are the key considerations when implementing a comprehensive enterprise-level authentication system?',
		content:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tellus neque, egestas id felis et, mollis tempor enim. Quisque accumsan, ligula viverra posuere sagittis, nulla nibh porta libero, ultrices fermentum nibh leo non justo. Aenean porta tristique dolor, quis convallis leo tempus eu. Curabitur dolor enim, tristique ornare sem eget, pulvinar eleifend quam.\n',
	},
];
export const Default: Story = {
	args: {
		type: 'multiple',
		className: 'w-md mx-auto',
		items: accordionItems,
	},
};

export const NoArrowsNoSeparator: Story = {
	args: {
		type: 'multiple',
		className: 'w-md mx-auto',
		items: accordionItems,
		showArrows: false,
		showSeparators: false,
		secondaryText: true,
	},
};

export default meta;
