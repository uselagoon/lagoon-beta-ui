'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

// set localStorage theme on first mount
export function useSyncTheme() {
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		if (resolvedTheme && localStorage.getItem('theme') !== resolvedTheme) {
			localStorage.setItem('theme', resolvedTheme);
		}
	}, [resolvedTheme]);
}
