import { Meta, StoryObj } from '@storybook/react';
import { Story } from '@storybook/addon-docs/blocks';
import { default as DateRangePicker } from '../components/DateRangePicker';

const meta: Meta<typeof DateRangePicker> = {
	component: DateRangePicker,
	title: 'ui-library/DateRangePicker',
	tags: ['autodocs'],
};

type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
	args: {
		onUpdate: (values) => console.log(values),
		// initialDateFrom: '2025-01-01',
		// initialDateTo: '2025-12-31',
		align: 'start',
		locale: 'en-GB',
		showCompare: false,
		rangeText: 'Select a range',
	},
};

export default meta;
