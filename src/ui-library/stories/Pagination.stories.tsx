import { Meta, StoryObj } from '@storybook/react';
import { Story } from '@storybook/addon-docs/blocks';
import { default as Pagination } from '../components/Pagination';

const meta: Meta<typeof Pagination> = {
	component: Pagination,
	title: 'ui-library/Pagination',
	tags: ['autodocs'],
};

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
	args: {
		allItems: 100,
		itemsPerPage: 5,
		initialPage: 1,
	},
};

export default meta;
