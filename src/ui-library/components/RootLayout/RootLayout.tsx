import React, { ReactNode } from 'react';
import { SidebarProvider } from '../ui/sidebar';
import Sidenav from '../Sidenav';
import ThemeProvider from '@ui-lib/providers/ThemeProvider';
import { AppInfo, SidebarItem, SidebarSection, UserInfo } from '@ui-lib/components/Sidenav/Sidenav';
import { AnnouncementCardProps } from '@ui-lib/components/AnnouncementCard/AnnouncementCard';

export type EnvNavFn = (projectSlug: string, environmentSlug: string) => Promise<SidebarItem[]>;

export type OrgNavFn = (orgSlug: string) => Promise<SidebarItem[]>;

export type ProjectNavFn = (
	projectSlug: string,
	environmentSlug?: string,
	getEnvironmentNav?: EnvNavFn,
) => Promise<SidebarItem[]>;

interface RootLayoutProps {
	userInfo: UserInfo;
	appInfo: AppInfo;
	sidenavItems: SidebarSection[];
	children: ReactNode;
	signOutFn: () => Promise<void>;
	currentPath: string;
	documentationUrl?: string;
	cardProps?: AnnouncementCardProps;
	disableAccountLink?: boolean;
	disableChangeFeedLink?: boolean;
}

//**
// Root layout wrapping the whole app with the side navigation
// */

export default function RootLayout({
	userInfo,
	appInfo,
	signOutFn,
	currentPath,
	children,
	sidenavItems,
	documentationUrl,
	cardProps,
	disableAccountLink,
	disableChangeFeedLink,
}: RootLayoutProps) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
			<SidebarProvider defaultOpen>
				<div className="flex h-screen w-full overflow-hidden">
					<Sidenav {...{ userInfo, appInfo, signOutFn, currentPath, sidenavItems, documentationUrl, cardProps, disableAccountLink, disableChangeFeedLink }} />
					<main className="flex-1 overflow-y-auto ml-0 lg:ml-[290px]">
						<div className="mx-[16px]">
							{children}
						</div>
					</main>
				</div>
			</SidebarProvider>
		</ThemeProvider>
	);
}
