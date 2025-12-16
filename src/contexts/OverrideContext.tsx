'use client';

import {createContext, useContext} from "react";
import { type Overrides } from '@uselagoon/ui-library/schemas';

const OverrideContext = createContext<Overrides>({
	global: {},
	components: {}
});

export function OverrideProvider({ children, overrides }: { children: React.ReactNode, overrides: Overrides }) {
	return (
		<OverrideContext.Provider value={overrides}>
			{children}
		</OverrideContext.Provider>
	);
}

export function useOverrides() {
	return useContext(OverrideContext);
}