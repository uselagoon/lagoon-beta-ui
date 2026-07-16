import React, { ReactNode } from 'react';

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@ui-lib/components/ui/table';

type RenderFn = (renderItem: string) => ReactNode;

type DataType = {
	key: string;
	[prop: string]: any;
	rowRender?: RenderFn;
	rowClassName?: string;
};
export interface TableProps extends React.ComponentProps<'table'> {
	columns: {
		key: string;
		dataIndex: string;
		title: string;
		columnRender?: RenderFn;
		columnClassName?: string;
	}[];
	data: DataType[];
	caption?: string;
	footer?: {
		description: string;
		value: ReactNode;
		span?: number;
		footerClassName?: string;
	};
}

const renderItem = (renderFn: RenderFn | undefined, columnTitle: string) => {
	if (typeof renderFn === 'function') {
		return renderFn(columnTitle);
	}
	return columnTitle;
};

const BasicTable: React.FC<TableProps> = ({ columns, data, caption, footer, ...props }) => {
	return (
		<Table {...props}>
			{!!caption && <TableCaption>{caption}</TableCaption>}
			<TableHeader>
				<TableRow>
					{columns.map(({ key, columnRender, title, columnClassName }) => {
						return (
							<TableHead key={key} className={columnClassName ?? ''}>
								{renderItem(columnRender, title)}
							</TableHead>
						);
					})}
				</TableRow>
			</TableHeader>

			<TableBody>
				{data.map((dataItem) => {
					const filterProperties = ['rowClassName', 'rowRender', 'key'];

					const filteredItems = Object.entries(dataItem)
						.filter(([k]) => !filterProperties.includes(k))
						.map((filteredEntries) => filteredEntries[1]);

					const { rowClassName, rowRender } = dataItem;

					return (
						<TableRow key={dataItem.key}>
							{filteredItems.map((dataValue) => (
								<TableCell key={dataValue} className={rowClassName}>
									{renderItem(rowRender, dataValue)}
								</TableCell>
							))}
						</TableRow>
					);
				})}
			</TableBody>

			{footer && (
				<TableFooter className={footer?.footerClassName || 'basictable-footer'}>
					<TableRow>
						<TableCell colSpan={footer?.span || columns.length - 1}>{footer.description}</TableCell>
						<TableCell className="text-right">{footer.value}</TableCell>
					</TableRow>
				</TableFooter>
			)}
		</Table>
	);
};

BasicTable.displayName = 'Table';
export default BasicTable;
