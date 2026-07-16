import React, { forwardRef } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Controls, Primary, Stories, Story, Title } from '@storybook/addon-docs/blocks';

import RootLayout from '../components/RootLayout';
import { LinkProvider as NextLinkProvider } from '../providers/NextLinkProvider';
import { Building2, FolderOpen, HelpCircle, Home, Settings } from 'lucide-react';

const MockLink = forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>(
	({ href, children, ...rest }, ref) => (
		<a ref={ref} href={href} {...rest}>
			{children}
		</a>
	)
);

const meta = {
	component: RootLayout,
	title: 'ui-library/RootLayout',
	tags: ['autodocs'],
	parameters: {
		docs: {
			page: () => (
				<>
					<Title />
					<p>The Root Layout of the UI with nested navigation sidebar.</p>
					<Primary />
					<Controls />
					<Stories />
				</>
			),
		},
	},
	decorators: [
		(Story) => (
			<NextLinkProvider linkComponent={MockLink}>
				<Story />
			</NextLinkProvider>
		),
	],
} satisfies Meta<typeof RootLayout>;

type Story = StoryObj<typeof RootLayout>;

const mockUserInfo = {
	email: 'john.doe@example.com',
	name: 'John Doe',
};

const mockSignOutFn = async () => {
	console.log('Sign out clicked');
};

const mockSidenavItems = [
	{
		section: 'Main',
		sectionItems: [
			{
				title: 'Dashboard',
				url: '/dashboard',
				icon: Home,
			},
			{
				title: 'Projects',
				url: '/projects',
				icon: FolderOpen,
				children: [
					{
						title: 'Project Alpha',
						url: '/projects/alpha',
					},
					{
						title: 'Project Beta',
						url: '/projects/beta',
					},
				],
			},
			{
				title: 'Organizations',
				url: '/organizations',
				icon: Building2,
				children: [
					{
						title: 'Org 1',
						url: '/organizations/org-1',
					},
					{
						title: 'Org 2',
						url: '/organizations/org-2',
					},
				],
			},
		],
	},
	{
		section: 'Settings',
		sectionItems: [
			{
				title: 'Settings',
				url: '/settings',
				icon: Settings,
			},
			{
				title: 'Help',
				url: '/help',
				icon: HelpCircle,
			},
		],
	},
];

export const Default: Story = {
	args: {
		userInfo: {
			email: mockUserInfo.email,
			name: mockUserInfo.name,
		},
		appInfo: {
			name: 'Lagoon',
			version: 'v1.0.0',
			kcUrl: 'https://keycloak.example.com',
		},
		sidenavItems: mockSidenavItems,
		signOutFn: mockSignOutFn,
		currentPath: '/projects',
	},
	parameters: {
		design: {
			type: 'figspec',
			url: 'https://www.figma.com/file/iRRQQSnRmqdcoiysogtjO7/Dashboard?type=design&node-id=66-6597&mode=design&t=P00gx6yjJRZgHUuj-4',
		},
	},
};

export default meta;
