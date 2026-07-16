import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import LagoonProblemsOverview from '../components/ProblemsOverview';
import { Controls, Primary, Stories, Story, Title } from '@storybook/addon-docs/blocks';

const meta: Meta<typeof LagoonProblemsOverview> = {
	component: LagoonProblemsOverview,
	title: 'ui-library/ProblemsOverview',
	tags: ['autodocs'],
	parameters: {
		docs: {
			page: () => (
				<>
					<Title />
					<p>Lagoon UI specific problems overview (at a glance).</p>
					<Primary />
					<Controls />
					<Stories />
				</>
			),
		},
		design: {
			type: 'figspec',
			url: 'https://www.figma.com/file/iRRQQSnRmqdcoiysogtjO7/UI-v2---Master?type=design&node-id=0-15012&mode=design&t=Vm8fqTLERqbE74YW-4',
		},
	},
	argTypes: {
		problems: {
			description: 'Number of problems in total',
		},
		critical: {
			description: 'Number of critical problems',
		},
		high: {
			description: 'Number of high problems',
		},
		medium: {
			description: 'Number of medium problems',
		},
		low: {
			description: 'Number of low problems',
		},
	},
};

type Story = StoryObj<typeof LagoonProblemsOverview>;

export const Default: Story = {
	args: {
		problems: 99,
		critical: 99,
		high: 99,
		medium: 99,
		low: 99,
	},
};

export const Good: Story = {
	args: {
		problems: 3,
		critical: 0,
		high: 0,
		medium: 0,
		low: 3,
	},
};

export const Medium: Story = {
	args: {
		problems: 68,
		critical: 0,
		high: 35,
		medium: 10,
		low: 23,
	},
};

export const Bad: Story = {
	args: {
		problems: 99,
		critical: 1,
		high: 69,
		medium: 20,
		low: 9,
	},
};
export const Skeleton: Story = {
	args: {
		skeleton: true,
	},
};
export default meta;
