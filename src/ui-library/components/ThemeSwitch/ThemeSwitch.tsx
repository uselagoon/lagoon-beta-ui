import { useTheme } from 'next-themes';
import React from 'react';
import { useSyncTheme } from '@ui-lib/hooks/useSyncTheme';
import { Moon, Sun } from 'lucide-react';

export default function ThemeSwitch() {
	const { setTheme, theme, systemTheme } = useTheme();

	useSyncTheme();

	const handleToggleTheme = (theme: 'light' | 'dark') => {
		setTheme(theme);
		window.dispatchEvent(new Event('storage'));
	};

	const darkSwitcher = (
		<button onClick={() => handleToggleTheme('light')}>
			<Sun className="mr-2 h-5 w-5"/>
		</button>
	);

	const lightSwitcher = (
		<button onClick={() => handleToggleTheme('dark')}>
			<Moon className="mr-2 h-5 w-5"/>
		</button>
	);
	const renderThemeSwitcher = () => {
		if (theme === 'dark' || (theme === 'system' && systemTheme === 'dark')) return darkSwitcher;

		return lightSwitcher;
	};

	return <>{renderThemeSwitcher()}</>;
}