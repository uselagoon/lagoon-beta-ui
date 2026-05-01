'use client';
import React, { ReactNode } from 'react';
import { ChevronsUpDown, LifeBuoy, LogOut, ScrollText, UserRoundCog } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { SidebarMenuButton } from '../ui/sidebar';
import { useLinkComponent } from '@ui-lib/providers/NextLinkProvider';
import { AppInfo, FooterItem } from './Sidenav';

type SidenavFooterMenuProps = AppInfo & { footerItems: FooterItem[]; signOutFn: () => Promise<void>; avatar: ReactNode, userDisplayName: ReactNode, email: string, documentationUrl?: string; disableAccountLink?: boolean, disableChangeFeedLink?: boolean };

export default function SidenavFooterMenu({ email, kcUrl, signOutFn, avatar, userDisplayName, footerItems, documentationUrl = 'https://docs.lagoon.sh/', disableAccountLink = false, disableChangeFeedLink = false }: SidenavFooterMenuProps) {

	const Link = useLinkComponent();

	const renderAvatar = () => {

		if (avatar) {
			return (
				<>
					{avatar}
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">{userDisplayName}</span>
						<span className="truncate font-light text-xs">{email}</span>
					</div>
				</>
			)
		}
	};

	return (
		<DropdownMenu modal={false}>
			<section className="flex items-center gap-1 pl-1">
				<DropdownMenuTrigger className="w-full">
					<SidebarMenuButton size="lg" className="w-full">
						{renderAvatar()}
						<ChevronsUpDown className="ml-auto h-4 w-4" />
					</SidebarMenuButton>
				</DropdownMenuTrigger>
			</section>
			<DropdownMenuContent className="w-56" align="start" side="top" sideOffset={4}>
				{footerItems.map((item, index) => {
					const newTab = item.target === 'blank';

					return (
						<DropdownMenuItem asChild key={index}>
							<Link
								href={item.url}
								target={newTab ? '_blank' : '_self'}
								className="cursor-pointer"
							>
								{item.icon && <item.icon className="mr-2 h-4 w-4" />}
								{item.title}
							</Link>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
