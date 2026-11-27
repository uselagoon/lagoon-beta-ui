import type { Theme, ThemeTokens } from '@ui-lib/schemas';

// check for valid css
const SAFE_CSS_VALUE = /^(?!.*\/\*)(?!.*\*\/)[^;{}<>]+$/;

function sanitizeTokenValue(key: string, value: string): string {
	if (!SAFE_CSS_VALUE.test(value)) {
		throw new Error(`Unsafe CSS token value for "--${key}": "${value}"`);
	}
	return value;
}

function tokensToVars(tokens: ThemeTokens): string {
  return Object.entries(tokens)
    .filter(([, v]) => v !== undefined)
    .flatMap(([k, v]) => {
      try {
        return [`  --${k}: ${sanitizeTokenValue(k, v as string)};`];
      } catch (err) {
        console.warn(err);
        return [];
      }
    })
    .join('\n');
}

// converts the Theme into valid CSS for injection
export function buildThemeStyle(theme: Theme): string {
	const parts: string[] = [];

	if (theme.light && Object.keys(theme.light).length > 0) {
		parts.push(`:root {\n${tokensToVars(theme.light)}\n}`);
	}

	if (theme.dark && Object.keys(theme.dark).length > 0) {
		parts.push(`.dark {\n${tokensToVars(theme.dark)}\n}`);
	}

	return parts.join('\n');
}
