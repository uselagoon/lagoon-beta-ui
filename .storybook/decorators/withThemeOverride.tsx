import React, { useEffect } from 'react';
import { Decorator } from '@storybook/react';
import { buildThemeStyle } from '../../src/ui-library/lib/theme';
import type { Theme } from '../../src/ui-library/schemas';

const STYLE_TAG_ID = 'sb-theme-override';

// decorator to set the theme overrides
const withThemeOverride: Decorator = (Story, context) => {
  const themeOverride: Theme | undefined = context.parameters.themeOverride;

  useEffect(() => {
    const hasThemeOverride = themeOverride && ((themeOverride.light && Object.keys(themeOverride.light).length > 0) || (themeOverride.dark && Object.keys(themeOverride.dark).length > 0));

    let style = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;

    if (hasThemeOverride) {
      if (!style) {
        style = document.createElement('style');
        style.id = STYLE_TAG_ID;
        document.head.appendChild(style);
      }
      try {
        style.textContent = buildThemeStyle(themeOverride!);
      } catch (err) {
        console.warn('[withThemeOverride] Rejected unsafe theme token value:', err);
        style.textContent = '';
      }
    } else {
      style?.remove();
    }

    return () => {
      document.getElementById(STYLE_TAG_ID)?.remove();
    };
  }, [JSON.stringify(themeOverride)]);

  return <Story />;
};

export default withThemeOverride;
