import { Meta, StoryObj } from '@storybook/react';
import { Story } from '@storybook/addon-docs/blocks';
import { default as ActionButton } from '../components/ActionButton';
import {GitBranch, Zap} from "lucide-react";
import {Button} from "@ui-lib/components/ui/button.tsx";
import {useState} from "react";

const meta: Meta<typeof ActionButton> = {
	component: ActionButton,
	title: 'ui-library/ActionButton',
	tags: ['autodocs'],
};

type Story = StoryObj<typeof ActionButton>;

const deploymentOptions = [
	{
		id: 'full',
		icon: <GitBranch size={20} className="size-5" />,
		title: 'Full Deployment',
		description: 'Builds new images and applies all pending changes including variables, routes, and services.',
	},
	{
		id: 'variables',
		icon: <Zap size={20} className="size-5" />,
		title: 'Variables Only Deployment',
		description: 'Faster deployment that updates runtime variables and restarts pods. Does not rebuild images.',
	},
];

export const Default: Story = {
	args: {
		title: 'Button Title',
		onSelect: () => alert('Button Clicked!'),
		description: 'Default action button description',
		selected: true,
		icon: deploymentOptions[0].icon,
	}
}
export const DualActionSetup: Story = {
	render: () => {
		const [selectedDeployment, setSelectedDeployment] = useState('full');
		return (
		<div className="w-fit mx-auto p-4 border rounded-lg">
			<div className="flex gap-3">
				{deploymentOptions.map(option => (
					<ActionButton
						key={option.id}
						title={option.title}
						icon={option.icon}
						onSelect={() => setSelectedDeployment(option.id)}
						description={option.description}
						selected={selectedDeployment === option.id}
					>
					</ActionButton>
				))}
			</div>
			<div className="flex justify-end mt-4">
				<Button>Run</Button>
			</div>
		</div>)
	},
};

export const Disabled: Story = {
	args: {
		title: 'Disabled Button',
		description: 'This action button is disabled',
		selected: false,
		icon: <Zap size={20} className="size-5" />,
		disabled: true,
	},
};

export default meta;