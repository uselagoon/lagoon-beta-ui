import React, { useEffect } from 'react';

import { Decorator, StoryContext } from '@storybook/react';
import { ThemeProvider, useTheme } from 'next-themes';

const ThemeSynchronizer = ({ theme }: { theme: string }) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  return null;
};

const withThemeProvider: Decorator = (Story, context: StoryContext) => {
  const theme = context.globals?.theme || 'dark';

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={theme}
      enableSystem={theme === 'system'}
      forcedTheme={theme !== 'system' ? theme : undefined}
      disableTransitionOnChange
    >
      <ThemeSynchronizer theme={theme} />
      <div className="min-h-screen bg-background text-foreground">
        <Story />
      </div>
    </ThemeProvider>
  );
};

export default withThemeProvider;
