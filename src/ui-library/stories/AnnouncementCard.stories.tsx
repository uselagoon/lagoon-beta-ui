import { Meta, StoryObj } from '@storybook/react';
import { Controls, Primary, Stories, Title } from '@storybook/addon-docs/blocks';

import AnnouncementCard from '../components/AnnouncementCard';

const meta: Meta<typeof AnnouncementCard> = {
	component: AnnouncementCard,
	title: 'ui-library/AnnouncementCard',
	tags: ['autodocs'],
	parameters: {
		docs: {
			page: () => (
				<>
					<Title />
					<p>
						Announcement card with close functionality. Displays promotional content with an icon, description,
						and call-to-action link.
					</p>
					<Primary />
					<Controls />
					<Stories />
				</>
			),
		},
	},
};

type Story = StoryObj<typeof AnnouncementCard>;

export const Default: Story = {
	args: {
		brand: 'amazee.ai',
		title: 'Announcing the Private AI Assistant now available in beta!',
		description: 'Secure, Private, Compliant.',
		ctaText: 'Sign up today for a free 14-day trial',
		ctaUrl: 'https://amazee.ai/private-ai-assistant#trial-signup',
		openInNewTab: true,
	},
};

export const CustomContent: Story = {
	args: {
		title: 'New Feature Available',
		description: 'Try our latest updates.',
		ctaText: 'Learn more',
		ctaUrl: 'https://example.com',
		openInNewTab: true,
	},
};

export const SameTab: Story = {
	args: {
		title: 'Announcing the Private AI Assistant now available in beta!',
		description: 'Secure, Private, Compliant.',
		ctaText: 'Sign up today for a free 14-day trial',
		ctaUrl: 'https://amazee.ai/private-ai-assistant#trial-signup',
		openInNewTab: false,
	},
};

export default meta;
