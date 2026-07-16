'use client';
import React, { ReactNode } from 'react';
import { ChevronsUpDown, LifeBuoy, LogOut, ScrollText, UserRoundCog } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { SidebarMenuButton } from '../ui/sidebar';
import { useLinkComponent } from '@ui-lib/providers/NextLinkProvider';
import { AppInfo } from './Sidenav';

type DropdownProps = AppInfo & { signOutFn: () => Promise<void>; avatar: ReactNode, userDisplayName: ReactNode, email: string, documentationUrl?: string; disableAccountLink?: boolean, disableChangeFeedLink?: boolean };

export default function SidenavFooterMenu({ email, kcUrl, signOutFn, avatar, userDisplayName, documentationUrl = 'https://docs.lagoon.sh/', disableAccountLink = false, disableChangeFeedLink = false }: DropdownProps) {

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
				<DropdownMenuItem asChild>
					<Link href={documentationUrl} target="_blank" className="cursor-pointer">
						<LifeBuoy className="mr-2 h-4 w-4" />
						Documentation
					</Link>
				</DropdownMenuItem>
				{!disableChangeFeedLink && (
					<DropdownMenuItem asChild>
						<Link href="/changefeed" className="cursor-pointer">
							<ScrollText className="mr-2 h-4 w-4" />
							Change Feed
						</Link>
					</DropdownMenuItem>
				)}
				{!disableAccountLink && (
					<DropdownMenuItem asChild>
						<Link href={`${kcUrl}/account`} target="_blank" className="cursor-pointer">
							<UserRoundCog className="mr-2 h-4 w-4" />
							My Account
						</Link>
					</DropdownMenuItem>
				)}
				<DropdownMenuItem asChild onClick={() => signOutFn()}>
					<div onClick={() => signOutFn()} className="flex items-center w-full cursor-pointer">
						<LogOut className="mr-2 h-4 w-4" />
						Sign Out
					</div>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
