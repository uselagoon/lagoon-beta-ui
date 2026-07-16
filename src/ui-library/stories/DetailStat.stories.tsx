import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { default as DetailStat } from '../components/DetailStat';
import { Controls, Primary, Stories, Story, Title } from '@storybook/addon-docs/blocks';

const meta: Meta<typeof DetailStat> = {
	component: DetailStat,
	title: 'ui-library/DetailStat',
	tags: ['autodocs'],
	parameters: {
		docs: {
			page: () => (
				<>
					<Title />
					<p>Simple Statistic component</p>
					<Primary />
					<Controls />
					<Stories />
				</>
			),
		},
	},
};

type Story = StoryObj<typeof DetailStat>;

export const Default: Story = {
	args: {
		title: 'Some Quota',
		value: 'Some quota: 10 out of 100',
	},
};

export const Numeric: Story = {
	args: {
		title: 'Environments',
		value: 2,
	},
};

export const UsingReactNode: Story = {
	args: {
		title: 'Environments',
		value: <div>Count: 123</div>,
	},
};

export default meta;
