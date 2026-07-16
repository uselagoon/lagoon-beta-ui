import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { default as CopyToClipboard } from '../components/CopyToClipboard';
import { Controls, Primary, Stories, Story, Title } from '@storybook/addon-docs/blocks';

const meta: Meta<typeof CopyToClipboard> = {
	component: CopyToClipboard,
	title: 'ui-library/CopyToClipboard',
	tags: ['autodocs'],
	parameters: {
		docs: {
			page: () => (
				<>
					<Title />
					<p>Copy to clipboard component</p>
					<Primary />
					<Controls />
					<h3>If the content is larger than the container, ellipsis is applied</h3>
					<Stories />
				</>
			),
		},
		design: {
			type: 'figspec',
			url: 'https://www.figma.com/file/iRRQQSnRmqdcoiysogtjO7/UI-v2---Master?type=design&node-id=0-15520&mode=design&t=Vm8fqTLERqbE74YW-4',
		},
	},
	argTypes: {
		width: {
			description: 'Max width of the component',
			defaultValue: { summary: '18.75rem computed in px' },
		},
		text: {
			description: 'Copyable text',
		},
		type: {
			description: 'Max width of the component',
		},
	},
};

type Story = StoryObj<typeof CopyToClipboard>;

export const Default: Story = {
	args: {
		width: 250,
		text: 'github.com/amazeeio-demos/as-demo',
	},
};

export const WithToolTip: Story = {
	args: {
		width: 250,
		withToolTip: true,
		text: 'github.com/amazeeio-demos/as-demo',
	},
};

export const HiddenEllipsis: Story = {
	args: {
		width: 150,
		type: 'hidden',
		text: 'https://github.com/uselagoon/lagoon-ui',
	},
};

export const HiddenLarge: Story = {
	args: {
		width: 250,
		type: 'hidden',
		text: 'https://github.com/uselagoon/lagoon-ui',
	},
};

export const HiddenWithIcon: Story = {
	args: {
		width: 250,
		type: 'hiddenWithIcon',
		text: 'https://github.com/uselagoon/lagoon-ui',
	},
};

export const IconOnly: Story = {
	args: {
		text: 'https://github.com/uselagoon/lagoon-ui',
		iconOnly: true,
	},
};
export default meta;
