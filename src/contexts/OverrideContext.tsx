'use client';

import {createContext, useContext} from "react";

export interface ComponentOverrides {
	[componentName: string]: Record<string, any>;
}

export interface OverrideSchema {
	global: Record<string, any>;
	components: ComponentOverrides;
}

const OverrideContext = createContext<OverrideSchema>({
	global: {},
	components: {}
});

export function OverrideProvider({ children, overrides }: { children: React.ReactNode, overrides: OverrideSchema }) {
	return (
		<OverrideContext.Provider value={overrides}>
			{children}
		</OverrideContext.Provider>
	);
}

export function useOverrides() {
	return useContext(OverrideContext);
}