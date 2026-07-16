import React, { forwardRef } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Controls, Primary, Stories, Story, Title } from '@storybook/addon-docs/blocks';
import { Home, FolderOpen, Building2, Settings, HelpCircle } from 'lucide-react';

import Sidenav from '../components/Sidenav';
import { LinkProvider as NextLinkProvider } from '../providers/NextLinkProvider';
import { SidebarProvider } from '../components/ui/sidebar';

const MockLink = forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>(
	({ href, children, ...rest }, ref) => (
		<a ref={ref} href={href} {...rest}>
			{children}
		</a>
	)
);

const meta: Meta<typeof Sidenav> = {
	component: Sidenav,
	title: 'ui-library/Sidenav',
	tags: ['autodocs'],
	parameters: {
		docs: {
			page: () => (
				<>
					<Title />
					<p>The main UI navigation sidebar.</p>
					<Primary />
					<Controls />
					<Stories />
				</>
			),
		},
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<NextLinkProvider linkComponent={MockLink}>
				<SidebarProvider>
					<div style={{ height: '100vh', display: 'flex' }}>
						<Story />
						<div style={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5' }}>
							<h2>Main Content Area</h2>
							<p>This is where your main application content would appear.</p>
						</div>
					</div>
				</SidebarProvider>
			</NextLinkProvider>
		),
	],
};

type Story = StoryObj<typeof Sidenav>;

const mockUserInfo = {
	email: 'john.doe@example.com',
	name: 'John Doe',
};

const mockSignOutFn = async () => {
	console.log('Sign out clicked');
};

const cardProps = {
	brand: 'Lagoon',
	title: 'Welcome to Lagoon!',
	description: 'Check out the new features in this release.',
	buttonText: 'Learn More',
	buttonUrl: 'https://docs.lagoon.sh/',
	defaultLogo: true,
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
		cardProps: cardProps,
	},
	parameters: {
		design: {
			type: 'figspec',
			url: 'https://www.figma.com/file/iRRQQSnRmqdcoiysogtjO7/Dashboard?type=design&node-id=66-6597&mode=design&t=P00gx6yjJRZgHUuj-4',
		},
	},
};

export default meta;