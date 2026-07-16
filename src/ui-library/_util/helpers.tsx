import React, { ReactNode } from 'react';
import Highlighter from 'react-highlight-words';

export const highlightTextInElement = (element: ReactNode, searchString: string, key: string | number): any => {
	// recursively apply highlighting to all text nodes
	if (typeof element === 'string') {
		return (
			<Highlighter highlightClassName="highlighted" searchWords={[searchString]} autoEscape textToHighlight={element} />
		);
	}

	if (React.isValidElement(element)) {
		return React.cloneElement(
			element,
			//@ts-ignore
			{ ...element.props, key: `item-${key}` },
			//@ts-ignore
			React.Children.map(element.props.children, (child, index) =>
				highlightTextInElement(child, searchString, `${index}-${key}`),
			),
		);
	}

	return element;
};

export const genAvatarBackground = (
	firstLetter: string,
	secondLetter: string,
): { bgColor: string; textColor: string } => {
	const alphaPosition = (letter: string): number => letter.charCodeAt(0) - 64;
	const getColorIndex = (letter: string): number => Math.round(alphaPosition(letter) * 11);

	let red = getColorIndex(firstLetter) % 256;
	let green = getColorIndex(secondLetter) % 256;
	let blue = Math.round(((alphaPosition(firstLetter) + alphaPosition(secondLetter)) / 2) * 11) % 256;

	return {
		bgColor: `rgb(${red}, ${green}, ${blue})`,
		textColor: getLuminance(red, green, blue) > 0.5 ? '#000000' : '#FFFFFF',
	};
};

function getLuminance(r: number, g: number, b: number) {
	// normalize the RGB values to the range [0, 1]
	const a = [r, g, b].map((v) => {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
	});

	// calculate the luminance. reference: https://www.w3.org/WAI/GL/wiki/Relative_luminance
	return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

const daysToMilliseconds = (days: number) => days * 24 * 60 * 60 * 1000;

export const setLocalStorage = (key: string, value: string | boolean, expiryDays: number) => {
	const now = new Date();
	const lsItem = {
		value: value,
		expiry: now.getTime() + daysToMilliseconds(expiryDays),
	};
	localStorage.setItem(key, JSON.stringify(lsItem));
};

export const getLocalStorage = (key: string) => {
	const lsItem = localStorage.getItem(key);
	if (!lsItem) {
		return null;
	}
	const result = JSON.parse(lsItem);
	if (result.expiry < Date.now()) {
		localStorage.removeItem(key);
		return null;
	}
	return result.value;
};