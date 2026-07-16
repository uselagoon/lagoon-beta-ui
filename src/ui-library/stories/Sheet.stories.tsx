import { Meta, StoryObj } from '@storybook/react';
import { Story } from '@storybook/addon-docs/blocks';
import { default as Sheet } from '../components/Sheet';
import Accordion from '../components/Accordion';

const meta: Meta<typeof Sheet> = {
	component: Sheet,
	title: 'ui-library/Sheet',
	tags: ['autodocs'],
};

type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
	args: {
		sheetFields: [
			{
				id: 'sheet-demo',
				label: 'Name',
				inputDefault: 'Placeholder',
			},
			{
				id: 'sheet-demo-username',
				label: 'Username',
				inputDefault: 'Placeholder',
			},
		],
	},
};

export const Custom: Story = {
	args: {
		sheetTitle: 'Edit',
		sheetTrigger: 'Edit Profile',
		sheetDescription: 'Test Description',
		sheetFooterButton: 'Save!!',
		buttonAction: (_, vals) => {
			console.warn(vals);
		},
		additionalContent: (
			<div className="text-purple-700">
				<p>Hello World</p>
			</div>
		),
		sheetFields: [
			{
				id: 'sheet-demo',
				label: 'Name',
				inputDefault: 'Placeholder',
				required: true,
			},
			{
				id: 'sheet-demo-username',
				label: 'Username',
				inputDefault: 'Placeholder',
			},
		],
	},
};

export const WithExtraItems: Story = {
	args: {
		sheetTitle: 'Edit',
		sheetTrigger: 'Edit Profile',
		sheetDescription: 'Test Description',
		sheetFooterButton: 'Save!!',
		buttonAction: (_, vals) => {
			console.warn(vals);
		},
		sheetFields: [
			{
				id: 'sheet-demo',
				label: 'Name',
				inputDefault: 'Placeholder',
				required: true,
			},
			{
				id: 'sheet-demo-username',
				label: 'Username',
				inputDefault: 'Placeholder',
			},
		],
		additionalContent: (
			<>
				<Accordion
					type="multiple"
					showArrows={false}
					items={[
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
					]}
				/>
			</>
		),
	},
};
export default meta;
