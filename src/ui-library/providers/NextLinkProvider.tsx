'use client';

import React, { createContext, useContext } from 'react';
import { NextLinkType } from '../typings/nextLink';

export const LinkContext = createContext<NextLinkType | undefined>(undefined);

export const LinkProvider: React.FC<{
	linkComponent: NextLinkType;
	children: React.ReactNode;
}> = ({ linkComponent, children }) => {
	return <LinkContext.Provider value={linkComponent}>{children}</LinkContext.Provider>;
};

export const useLinkComponent = () => {
	const context = useContext(LinkContext);
	if (!context) {
		throw new Error('useLinkComponent must be used within a LinkProvider');
	}
	return context;
};
