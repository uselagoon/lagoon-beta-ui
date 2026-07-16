import { Meta, StoryObj } from '@storybook/react';
import { Story } from '@storybook/addon-docs/blocks';

import { default as Table } from '../components/Table';

const meta: Meta<typeof Table> = {
	component: Table,
	title: 'ui-library/Table',
	tags: ['autodocs'],
};

type Story = StoryObj<typeof Table>;

export const Default: Story = {
	args: {
		caption: 'A basic table',
		columns: [
			{
				dataIndex: 'first',
				key: 'col-1',
				title: 'First item',
			},
			{
				dataIndex: 'second',
				key: 'col-2',
				title: 'Second item',
			},
		],
		data: [
			{
				key: 'custom',
				first: 'Custom rendered',
				second: 'Row with classes',
				rowRender: (item) => <div className="py-5">{item}</div>,
				rowClassName: 'bg-blue-100',
			},
			{
				key: 'normal',
				first: 'Something',
				second: 'Else',
			},
		],
		footer: {
			description: 'Footer summary',
			value: 'Here I am',
			footerClassName: 'drop-shadow-xl',
		},
	},
};

export default meta;
