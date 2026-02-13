import fs from 'fs';
import { ExtensionsConfig } from './types';
import { validateExtensionsConfig } from './schema';

const EXTENSIONS_FILE = 'extensions.json';

export function loadExtensions(): ExtensionsConfig {
  try {
    if (!fs.existsSync(EXTENSIONS_FILE)) {
      return { extensions: [] };
    }
    const parsed = JSON.parse(fs.readFileSync(EXTENSIONS_FILE, 'utf-8'));
    const { valid, errors } = validateExtensionsConfig(parsed);

    if (errors.length > 0) {
      console.error('Extension validation errors:');
      errors.forEach(err => console.error(`  ${err.path}: ${err.message}`));
    }

    if (valid) {
      const count = valid.extensions.length;
      if (count > 0) {
        console.log(`Loaded ${count} extension(s): ${valid.extensions.map(e => e.meta.name).join(', ')}`);
      }
      return valid;
    }
    return { extensions: [] };
  } catch (error) {
    console.error('Error loading extensions:', error);
    return { extensions: [] };
  }
}
