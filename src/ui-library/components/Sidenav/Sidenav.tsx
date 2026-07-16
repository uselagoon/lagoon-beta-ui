import React, { Fragment, useState } from 'react';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
} from '../ui/sidebar';

import SidenavFooterMenu from './SidenavFooterMenu';
import { genAvatarBackground } from '@ui-lib/_util/helpers';

import { Avatar, AvatarImage } from '../ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import AvatarBubble from '../AvatarBubble/AvatarBubble';
import { useLinkComponent } from '@ui-lib/providers/NextLinkProvider';
import { NextLinkType } from '@ui-lib/typings/nextLink';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

import { ChevronUp, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@ui-lib/lib/utils';
import useActivePaths from './useActivePaths';
import SidenavLogo from '@ui-lib/components/Sidenav/SidenavLogo';
import AnnouncementCard from '@ui-lib/components/AnnouncementCard';
import { AnnouncementCardProps } from '@ui-lib/components/AnnouncementCard/AnnouncementCard';

type SidebarProps = React.ComponentProps<typeof Sidebar>;

export type UserInfo = {
	email: string;
	image?: React.ImgHTMLAttributes<HTMLImageElement>['src'];
	name?: string;
};

export type AppInfo = {
	name: string;
	version: string;
	kcUrl: string;
};

export type SidenavProps = SidebarProps & {
	userInfo: UserInfo;
	appInfo: AppInfo;
	sidenavItems: SidebarSection[];
	signOutFn: () => Promise<void>;
	currentPath: string;
	documentationUrl?: string;
	cardProps?: AnnouncementCardProps;
	disableAccountLink?: boolean;
	disableChangeFeedLink?: boolean;
};

export type SidebarItem = {
	title: string;
	url: string;
	icon?: React.ComponentType<any>;
	target?: string;
	onClick?: () => void;
	children?: SidebarItem[];
};

export type SidebarSection = {
	section: string;
	sectionItems: SidebarItem[];
};

const renderSidenavChildren = (
	Link: NextLinkType,
	sectionItem: SidebarItem,
	activePaths: Set<string>,
): React.JSX.Element | null => {
	if (!sectionItem.children?.length) return null;

	return (
		<ul className="ml-4 mt-2 space-y-1">
			{sectionItem.children.map((child: any) => {
				const hasChildren = child.children && child.children.length > 0;
				const isActive = hasChildren
					? activePaths.has(child.url) || activePaths.has(`${child.url}:parent`)
					: activePaths.has(child.url);

				return (
					<SidebarMenuItem key={child.title}>
						<SidebarMenuButton asChild isActive={isActive}>
							<Link href={child.url} className={`${!child.icon ? 'ml-4' : ''}`}>
								<div className="flex items-center gap-2">
									{child.icon && <child.icon />}
									<span>{child.title}</span>
								</div>
							</Link>
						</SidebarMenuButton>
						{renderSidenavChildren(Link, child, activePaths)}
					</SidebarMenuItem>
				);
			})}
		</ul>
	);
};

export default function Sidenav({ userInfo, appInfo, currentPath, sidenavItems, signOutFn, documentationUrl, cardProps, disableAccountLink, disableChangeFeedLink, ...props }: SidenavProps) {
	const Link = useLinkComponent();

	const { name, image, email } = userInfo;

	const userImageExists = !!image;

	const nameParts = name?.split(' ') ?? [];
	const firstName = nameParts[0] ?? undefined;
	const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ' ';

	const firstLastProvided = !!(firstName && lastName);

	const avatarBg = firstLastProvided
		? genAvatarBackground(firstName.charAt(0), lastName.charAt(0))
		: genAvatarBackground(email.charAt(0), email.charAt(1));

	const avatarInitials = firstLastProvided
		? firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()
		: email.charAt(0).toUpperCase();

	// show img + firstname lastnamea
	// or avatarbg + firstname lastname
	// or genericImage + user email

	const avatarToUse = userImageExists ? (
		<Avatar>
			<AvatarImage src={image} alt="user_avatar" />
			<AvatarFallback>Avatar</AvatarFallback>
		</Avatar>
	) : (
		<AvatarBubble bgColor={avatarBg.bgColor} textColor={avatarBg.textColor}>
			{avatarInitials}
		</AvatarBubble>
	);

	const userDisplayName = firstLastProvided ? (
		<span className="user-name">{`${firstName} ${lastName}`}</span>
	) : (
		<span className="user-name">{email}</span>
	);

	const activePaths = useActivePaths(sidenavItems, currentPath);

	const [mobileOpen, setMobileOpen] = useState(false);

	const sidenavProps = {
		...appInfo,
		signOutFn,
		avatar: avatarToUse,
		userDisplayName,
		email,
		documentationUrl: documentationUrl,
		disableAccountLink,
		disableChangeFeedLink,
	};

	return (
		<>
			{!mobileOpen && (
				<div className="lg:hidden fixed top-2 left-4 z-40">
					<Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} aria-label="Open sidebar">
						<Menu className="h-5 w-5" />
					</Button>
				</div>
			)}
			<Sidebar
				variant="sidebar"
				collapsible="none"
				{...props}
				className={cn(
					'fixed top-0 left-0 z-40 h-screen bg-background transition-transform duration-300',
					'min-w-[290px] overflow-hidden',
					'flex flex-col',
					mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
				)}
			>
				{mobileOpen && (
					<div className="lg:hidden absolute top-4 right-0">
						<Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close sidebar">
							<X className="h-5 w-5" />
						</Button>
					</div>
				)}
				<div className="flex-shrink-0">
					<SidenavLogo />
				</div>

				<SidebarContent className="flex-1 overflow-y-auto min-h-0">
					{sidenavItems.map((navItem) => {
						return (
							<SidebarGroup key={navItem.section}>
								<SidebarGroupLabel>{navItem.section}</SidebarGroupLabel>
								<SidebarGroupContent className="list-none">
									{navItem.sectionItems.map((sectionItem) => {
										const newTab = sectionItem.target === 'blank';
										const action = sectionItem?.onClick;

										const collapsibleOpen = Array.from(activePaths).some((p) => p.startsWith(sectionItem.url));
										const collapsibleSections = ['Projects', 'Organizations'];
										const renderCollapseIcon = collapsibleSections.includes(sectionItem.title);

										return (
											<Fragment key={sectionItem.title}>
												<Collapsible open={collapsibleOpen}>
													<SidebarMenuItem>
														<CollapsibleTrigger asChild>
															<SidebarMenuButton
																asChild
																isActive={
																	activePaths.has(sectionItem.url) || activePaths.has(`${sectionItem.url}:parent`)
																}
															>
																<Link
																	data-cy={`nav-${sectionItem.url.slice(1)}`}
																	onClick={async () => {
																		action && (await action());
																	}}
																	href={sectionItem.url}
																	target={newTab ? '_blank' : '_self'}
																	className="flex w-full gap-2"
																>
																	<div className="flex items-center gap-2">
																		{sectionItem.icon && <sectionItem.icon />}
																		<span>{sectionItem.title}</span>
																	</div>

																	{renderCollapseIcon ? (
																		<ChevronUp
																			className={`ml-auto h-4 w-4 transition-transform ${collapsibleOpen ? 'rotate-180' : 'rotate-90'}`}
																		/>
																	) : null}
																</Link>
															</SidebarMenuButton>
														</CollapsibleTrigger>
													</SidebarMenuItem>

													<CollapsibleContent>
														<SidebarMenuSub>
															{sectionItem.children?.map((child) => (
																<SidebarMenuItem key={child.title}>
																	<SidebarMenuButton
																		asChild
																		isActive={activePaths.has(child.url) || activePaths.has(`${child.url}:parent`)}
																	>
																		<Link href={child.url} className="mt-2">
																			<div className="flex items-center gap-2">
																				{child.icon && <child.icon />}
																				<span>{child.title}</span>
																			</div>
																		</Link>
																	</SidebarMenuButton>
																	{renderSidenavChildren(Link, child, activePaths)}
																</SidebarMenuItem>
															))}
														</SidebarMenuSub>
													</CollapsibleContent>
												</Collapsible>
											</Fragment>
										);
									})}
								</SidebarGroupContent>
							</SidebarGroup>
						);
					})}
				</SidebarContent>

				<SidebarFooter className="flex-shrink-0">
					<SidebarGroup>
						<SidebarGroupContent>
							<AnnouncementCard {...(cardProps || {})}></AnnouncementCard>
						</SidebarGroupContent >
					</SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidenavFooterMenu {...sidenavProps} />
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			</Sidebar>
			{mobileOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />}
		</>
	);
}
