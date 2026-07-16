import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from 'next-themes';

import ThemeSwitch from "../components/ThemeSwitch"

const ThemeSwitchDemo = () => {
	return (
		<ThemeProvider attribute="class" enableSystem={false} storageKey="theme-switch-demo" disableTransitionOnChange>
			<div className="flex flex-col items-center gap-4 p-8 min-h-[100px] bg-background text-foreground rounded-lg border">
				<p className="text-sm font-medium">Click to toggle the theme:</p>
				<ThemeSwitch />
			</div>
		</ThemeProvider>
	);
};

const meta: Meta<typeof ThemeSwitch> = {
	component: ThemeSwitch,
	title: 'ui-library/ThemeSwitch',
	tags: ['autodocs'],
	parameters: {
		disableGlobalTheme: true, // Stops the global theme provider from overriding this story
	},
};

type ThemeSwitchStory = StoryObj<typeof ThemeSwitch>;

export const Default: ThemeSwitchStory = {
	render: () => <ThemeSwitchDemo />
};

export default meta;