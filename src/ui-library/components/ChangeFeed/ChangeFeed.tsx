import { ChangeFeedItemProps, default as ChangeFeedItem } from './ChangeFeedItem';
import Checkbox from "@ui-lib/components/Checkbox";
import { useState, useMemo, useRef, useEffect } from "react";

type ChangeFeedProps = {
	changeFeedItems?: ChangeFeedItemProps[];
}

function ChangeFeed({ changeFeedItems = [] }: ChangeFeedProps) {
	const [filteredItems, setFilteredItems] = useState(changeFeedItems);
	const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(['All']));
	const [visibleCount, setVisibleCount] = useState(10);
	const observerTarget = useRef<HTMLDivElement>(null);

	const filters = useMemo(() => {
		const filterSet = new Set<string>(['All']);
		changeFeedItems?.forEach(activityData => {
			activityData.tags?.forEach(tag => {
				filterSet.add(tag);
			});
		});

		return Array.from(filterSet);
	}, [changeFeedItems]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting) {
					setVisibleCount(prev => prev + 10);
				}
			},
			{ threshold: 1.0 }
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => observer.disconnect();
	}, [filteredItems]);

	useEffect(() => {
		setVisibleCount(10);
	}, [activeFilters]);

	if (!filteredItems || filteredItems.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="border rounded-lg p-8 max-w-md text-center">
					<p className="text-lg font-medium mb-2">No activity to display</p>
					<p className="text-sm">Check back later for updates and new features.</p>
				</div>
			</div>
		);
	}

	const filterList = () => (
		filters.map(filter => {
			return (
				<Checkbox key={filter} id={filter} label={filter} className="my-2" checked={activeFilters.has(filter)} onCheckedChange={(checked) => handleFilter(filter, checked)} />
			)
		}));

	const handleFilter = (filter: string, checked: boolean | string) => {
		const newActiveFilters = new Set(activeFilters);

		if (filter === 'All') {
			if (checked) {
				setActiveFilters(new Set(['All']));
				setFilteredItems(changeFeedItems);
			}
			return;
		}

		newActiveFilters.delete('All')
		if (checked) {
			newActiveFilters.add(filter);
		} else {
			newActiveFilters.delete(filter);
		}

		if (newActiveFilters.size === 0) {
			setActiveFilters(new Set(['All']));
			setFilteredItems(changeFeedItems);
			return;
		}

		setActiveFilters(newActiveFilters);
		const newFilteredItems = changeFeedItems?.filter(item => item.tags?.some(tag => newActiveFilters.has(tag)));
		setFilteredItems(newFilteredItems);
	}

	const visibleItems = filteredItems.slice(0, visibleCount);

	return (
		<div className="flex gap-8 justify-between">
			<div className="flex-1">
				{visibleItems.map(activityData => (
					<ChangeFeedItem key={activityData.id} {...activityData} />
				))}
				{visibleCount < filteredItems.length && (
					<div ref={observerTarget} className="h-4 w-full" />
				)}
			</div>
			<aside className="min-w-[300px]" aria-label="Activity filters">
				<h3 className="text-sm font-semibold mb-2">Filter</h3>
				{filterList()}
			</aside>
		</div>
	)
}

export default ChangeFeed;
