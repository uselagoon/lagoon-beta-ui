import React, { Fragment, useState, useEffect } from 'react';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

import { ChevronLeft, ChevronRight, GitBranch, Menu, Search, X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@ui-lib/lib/utils';
import useActivePaths from './useActivePaths';
import SidenavLogo from '@ui-lib/components/Sidenav/SidenavLogo';
import AnnouncementCard from '@ui-lib/components/AnnouncementCard';
import { AnnouncementCardProps } from '@ui-lib/components/AnnouncementCard/AnnouncementCard';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import Input from '../Input';

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
	footerItems?: FooterItem[];
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
	collapsible?: boolean;
	environmentType?: 'production' | 'development';
};

export type FooterItem = {
	title: string;
	url: string;
	icon?: React.ComponentType<any>;
	target?: string;
	onClick?: () => void;
};

export type SidebarSection = {
	section: string;
	sectionItems: SidebarItem[];
};

const SidenavItem = ({
	item,
	activePaths,
	currentPath,
}: {
	item: SidebarItem;
	activePaths: Set<string>;
	currentPath: string;
}) => {
	const Link = useLinkComponent();
	const hasChildren = item.children && item.children.length > 0;
	const isActive = currentPath === item.url;
	const isOpen = activePaths.has(item.url) || activePaths.has(`${item.url}:parent`);

	const [internalOpen, setInternalOpen] = useState(isOpen);
	useEffect(() => {
		setInternalOpen(isOpen);
	}, [isOpen]);

	const newTab = item.target === 'blank';
	const action = item.onClick;

	if (hasChildren) {
		if (item.title === 'Environments') {
			return (
				<EnvironmentsNavItem
					item={item}
					activePaths={activePaths}
					currentPath={currentPath}
				/>
			);
		}

		const isCollapsible = item.collapsible !== false;
		if (isCollapsible) {
			return (
				<Collapsible open={internalOpen} onOpenChange={setInternalOpen} className="group/collapsible">
					<SidebarMenuItem>
						<SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
							<Link
								href={item.url}
								data-cy={`nav-${item.url.slice(1)}`}
								onClick={async (e: React.MouseEvent) => {
									if (action) await action();
								}}
								target={newTab ? '_blank' : '_self'}
								className="flex w-full items-center gap-2"
							>
								{item.icon && <item.icon className="!size-5" />}
								<span>{item.title}</span>
							</Link>
						</SidebarMenuButton>
						<CollapsibleTrigger asChild>
							<SidebarMenuAction className="data-[state=open]:rotate-90 transition-transform duration-200">
								<ChevronRight />
								<span className="sr-only">Toggle</span>
							</SidebarMenuAction>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<SidebarMenuSub>
								{item.children!.map((child) => (
									<SidenavItem
										key={child.title}
										item={child}
										activePaths={activePaths}
										currentPath={currentPath}
									/>
								))}
							</SidebarMenuSub>
						</CollapsibleContent>
					</SidebarMenuItem>
				</Collapsible>
			);
		}

		return (
			<SidebarMenuItem>
				<SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
					<Link
						href={item.url}
						data-cy={`nav-${item.url.slice(1)}`}
						onClick={async () => {
							action && (await action());
						}}
						target={newTab ? '_blank' : '_self'}
						className="flex w-full items-center gap-2"
					>
						{item.icon && <item.icon className="!size-5" />}
						<span>{item.title}</span>
					</Link>
				</SidebarMenuButton>
				<SidebarMenuSub>
					{item.children!.map((child) => (
						<SidenavItem
							key={child.title}
							item={child}
							activePaths={activePaths}
							currentPath={currentPath}
						/>
					))}
				</SidebarMenuSub>
			</SidebarMenuItem>
		);
	}

	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
				<Link
					href={item.url}
					data-cy={`nav-${item.url.slice(1)}`}
					onClick={async () => {
						action && (await action());
					}}
					target={newTab ? '_blank' : '_self'}
				>
					{item.icon && <item.icon className="!size-5" />}
					<span>{item.title}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};

const BrowseEnvironmentsSheet = ({allEnvs,}: { allEnvs: SidebarItem[];}) => {
	const Link = useLinkComponent();
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredEnvironments, setFilteredEnvironments] = useState(allEnvs);

	useEffect(() => {
    let results = allEnvs;
    if (searchQuery) {
      results = results.filter((env) =>
        env.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredEnvironments(results);
  }, [searchQuery, allEnvs])

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SidebarMenuItem>
				<SidebarMenuButton
					onClick={() => setOpen(true)}
					className="text-muted-foreground text-xs flex items-center gap-1"
				>
					<Search />
					<span>Browse Environments </span>
				</SidebarMenuButton>
			</SidebarMenuItem>
			<SheetContent side="right">
				<SheetHeader className="border-b flex justify-between">
					<SheetTitle className="flex items-center">
							<ChevronLeft className="h-5 w-5 mr-2 cursor-pointer" onClick={() => setOpen(false)} />
							<h2 className="text-lg font-semibold">Environments</h2>
					</SheetTitle>
				</SheetHeader>
			<div className="p-4 border-b">
				<div className='text-sm text-muted-foreground mb-2'>
					<Input
						type="text"
						placeholder={`Search environments...`} 
						className="pr-4 w-full"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>
			<div className="flex-1 overflow-y-auto p-2">
				<div className="space-y-1">
					{filteredEnvironments.length > 0 ? (
					filteredEnvironments.map((env, index) => (
						<div key={index} className="rounded-md hover:bg-accent p-2 group">
							<Link key={env.url} href={env.url} onClick={() => setOpen(false)} className="flex items-center gap-2">
								<GitBranch className="h-4 w-4" />
								<span className="text-sm">{env.title}</span>
								<span className={`ml-auto text-xs ${env.environmentType === 'development' ? 'text-[var(--env-development-bg)]' : 'text-[var(--env-production-bg)]'}`}>{env.environmentType}</span>
							</Link>
						</div>
					))
					) : (
					<div className="text-center py-8 text-muted-foreground">
						<p>No environments found</p>
					</div>
					)}
				</div>
			</div>
			</SheetContent>
		</Sheet>
	);
};

const EnvironmentsNavItem = ({item, activePaths, currentPath, }: { item: SidebarItem; activePaths: Set<string>; currentPath: string; }) => {
	const Link = useLinkComponent();
	const children = item.children ?? [];
	const active = children.findIndex(
		env => activePaths.has(env.url) || activePaths.has(`${env.url}:parent`)
	);
	let orderedEnvs: SidebarItem[];
	if (active > 0) {
		const activeEnv = children[active];
		const rest = children.filter((_, i) => i !== active);
		orderedEnvs = [activeEnv, ...rest];
	} else {
		orderedEnvs = children;
	}
	const visibleEnvs = orderedEnvs.slice(0, 3);
	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild isActive={currentPath === item.url} tooltip={item.title}>
				<Link href={item.url} data-cy={`nav-${item.url.slice(1)}`}>
					{item.icon && <item.icon className="!size-5" />}
					<span>{item.title}</span>
				</Link>
			</SidebarMenuButton>
			<SidebarMenuSub>
			{visibleEnvs.map((env) => {
				const isActiveEnv = activePaths.has(env.url) || activePaths.has(`${env.url}:parent`);
					if (isActiveEnv && env.children && env.children.length > 0) {
						return (
							<SidebarMenuItem key={env.url}>
								<SidebarMenuButton asChild isActive={currentPath === env.url} tooltip={env.title}>
									<Link href={env.url} data-cy={`nav-${env.url.slice(1)}`}>
										{env.icon && <env.icon className="!size-5" />}
										<span>{env.title}</span>
									</Link>
								</SidebarMenuButton>
								<SidebarMenuSub>
									{env.children.map((child) => (
										<SidenavItem
											key={child.url}
											item={child}
											activePaths={activePaths}
											currentPath={currentPath}
										/>
									))}
								</SidebarMenuSub>
							</SidebarMenuItem>
						);
					}

					return (
						<SidebarMenuItem key={env.url}>
							<SidebarMenuButton asChild isActive={currentPath === env.url} tooltip={env.title}>
								<Link href={env.url} data-cy={`nav-${env.url.slice(1)}`}>
									{env.icon && <env.icon className="!size-5" />}
									<span>{env.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
				<BrowseEnvironmentsSheet allEnvs={orderedEnvs} />
			</SidebarMenuSub>
		</SidebarMenuItem>
	);
};

export default function Sidenav({ userInfo, appInfo, currentPath, sidenavItems, signOutFn, documentationUrl, cardProps, footerItems, disableAccountLink, disableChangeFeedLink, ...props }: SidenavProps) {
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
		footerItems: footerItems || [],
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
									{navItem.sectionItems.map((sectionItem) => (
										<SidenavItem
											key={sectionItem.title}
											item={sectionItem}
											activePaths={activePaths}
											currentPath={currentPath}
										/>
									))}
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