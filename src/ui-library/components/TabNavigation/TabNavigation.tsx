import React, { FC } from 'react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

type NavItem = {
	key: string;
	label: React.ReactNode;
};

type TabNavigationProps = {
	items: NavItem[];
	pathname: string;
};

const TabNavigation: FC<TabNavigationProps> = ({ items, pathname }) => {
	// manually get active key for navigation and refresh.
	const getActiveValue = () => {
		for (const item of items) {
			if (pathname?.endsWith(`/${item.key}`) || pathname?.includes(`/${item.key}/`)) {
				return item.key;
			}
		}

		return items[0]?.key || '';
	};

	return (
		<>
			<Tabs value={getActiveValue()}>
				<TabsList>
					{items.map((navItem) => (
						<TabsTrigger value={navItem.key} key={navItem.key}>
							{navItem.label}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>
		</>
	);
};

TabNavigation.displayName = 'TabNavigation';

export type { TabNavigationProps };

export default TabNavigation;
