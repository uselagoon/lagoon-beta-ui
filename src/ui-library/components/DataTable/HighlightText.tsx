import Highlighter from 'react-highlight-words';

import React, { type ReactNode } from 'react';

export const highlightTextInElement = (element: ReactNode, searchString: string, key: string | number): any => {
	// recursively apply highlighting to all text nodes
	if (typeof element === 'string') {
		return (
			<Highlighter highlightClassName="highlighted" searchWords={[searchString]} autoEscape textToHighlight={element} />
		);
	}

	if (React.isValidElement(element)) {
		const props = element.props as Record<string, unknown>;
		return React.cloneElement(
			element,
			{ ...props, key: `item-${key}` },
			React.Children.map(props.children as ReactNode, (child, index) =>
				highlightTextInElement(child, searchString, `${index}-${key}`),
			),
		);
	}

	return element;
};
