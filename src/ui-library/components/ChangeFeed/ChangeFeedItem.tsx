import { Badge } from "@ui-lib/components/ui/badge";
import Accordion from "@ui-lib/components/Accordion";
import { useMemo } from "react";

export type ChangeFeedItemProps = {
	id: string;
	date: string;
	title: string;
	description: string;
	tags?: string[];
}

export default function ChangeFeedItem({ date, id, tags, description, title }: ChangeFeedItemProps) {

	const renderTags = useMemo(() => {
		if (!tags || tags.length === 0) {
			return null;
		}
		return tags.map((tag) => (
			<Badge key={tag} className="mr-2">{tag}</Badge>
		));
	}, [tags])

	const connector = (
		<div className="flex flex-col mr-6 items-center">
			<div className="border-2 border-gray-600 dark:border-gray-300 rounded-full h-4 w-4"></div>
			<div className="flex-1 border-l-2 border-gray-300 dark:border-gray-600"></div>
		</div>
	)

	return (
		<div className="flex">
			{connector}
			<div key={id} className="mb-4">
				<p className="text-gray-500 dark:text-gray-200 text-xs font-semibold">{date}</p>
				<Accordion defaultValue={[id]} className="[&_*]:justify-normal" type="multiple" items={[{
					id: id, trigger: <h2 className="text-l font-semibold">{title}</h2>,
					content: <>
						{description && (
							<p className="mb-6 text-gray-600 dark:text-gray-200">{description}</p>
						)}
						{renderTags}
					</>
				}]} />
			</div>
		</div>
	)
}