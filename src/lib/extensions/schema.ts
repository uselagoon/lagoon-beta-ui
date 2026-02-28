import { ExtensionManifest, ExtensionsConfig } from './types';

type ValidationError = { path: string; message: string };
type ValidationResult<T> = { valid: T | null; errors: ValidationError[] };

const validNavTargets = [
  'sidebar-projects', 'sidebar-deployments', 'sidebar-organizations', 'sidebar-settings',
] as const;

const validSlotLocations = [
  'project-header', 'project-footer', 'environment-header', 'environment-footer',
  'organization-header', 'organization-footer', 'global-header', 'global-footer',
] as const;

function validateNavItem(item: unknown, path: string, requireTarget = true): ValidationError[] {
  const errors: ValidationError[] = [];
  if (typeof item !== 'object' || item === null) {
    return [{ path, message: 'must be an object' }];
  }
  const nav = item as Record<string, unknown>;
  if (typeof nav.id !== 'string' || !nav.id) errors.push({ path: `${path}.id`, message: 'required string' });
  if (typeof nav.label !== 'string' || !nav.label) errors.push({ path: `${path}.label`, message: 'required string' });
  if (typeof nav.href !== 'string' || !nav.href) errors.push({ path: `${path}.href`, message: 'required string' });
  if (requireTarget && nav.target !== undefined && !validNavTargets.includes(nav.target as typeof validNavTargets[number])) {
    errors.push({ path: `${path}.target`, message: `must be one of: ${validNavTargets.join(', ')}` });
  }
  if (nav.requiredRoles !== undefined && !Array.isArray(nav.requiredRoles)) {
    errors.push({ path: `${path}.requiredRoles`, message: 'must be an array' });
  }
  return errors;
}

function validateExtension(ext: unknown, path: string): ValidationError[] {
  const errors: ValidationError[] = [];
  if (typeof ext !== 'object' || ext === null) {
    return [{ path, message: 'must be an object' }];
  }
  const extension = ext as Record<string, unknown>;

  if (typeof extension.meta !== 'object' || extension.meta === null) {
    errors.push({ path: `${path}.meta`, message: 'required object' });
  } else {
    const meta = extension.meta as Record<string, unknown>;
    if (typeof meta.name !== 'string') errors.push({ path: `${path}.meta.name`, message: 'required string' });
    if (typeof meta.version !== 'string') errors.push({ path: `${path}.meta.version`, message: 'required string' });
  }

  if (extension.navigation !== undefined) {
    const nav = extension.navigation as Record<string, unknown>;
    if (Array.isArray(nav.items)) {
      nav.items.forEach((item, i) => errors.push(...validateNavItem(item, `${path}.navigation.items[${i}]`)));
    }
    if (Array.isArray(nav.sections)) {
      nav.sections.forEach((section, i) => {
        const sec = section as Record<string, unknown>;
        if (typeof sec.section !== 'string') {
          errors.push({ path: `${path}.navigation.sections[${i}].section`, message: 'required string' });
        }
        if (Array.isArray(sec.items)) {
          sec.items.forEach((item, j) => errors.push(...validateNavItem(item, `${path}.navigation.sections[${i}].items[${j}]`, false)));
        }
      });
    }
  }

  if (Array.isArray(extension.pages)) {
    extension.pages.forEach((page, i) => {
      const p = page as Record<string, unknown>;
      if (typeof p.route !== 'string') errors.push({ path: `${path}.pages[${i}].route`, message: 'required string' });
    });
  }

  if (Array.isArray(extension.slots)) {
    extension.slots.forEach((slot, i) => {
      const s = slot as Record<string, unknown>;
      if (typeof s.id !== 'string') errors.push({ path: `${path}.slots[${i}].id`, message: 'required string' });
      if (typeof s.component !== 'string') errors.push({ path: `${path}.slots[${i}].component`, message: 'required string' });
      if (!validSlotLocations.includes(s.slot as typeof validSlotLocations[number])) {
        errors.push({ path: `${path}.slots[${i}].slot`, message: `must be one of: ${validSlotLocations.join(', ')}` });
      }
    });
  }

  return errors;
}

export function validateExtensionsConfig(data: unknown): ValidationResult<ExtensionsConfig> {
  if (typeof data !== 'object' || data === null) {
    return { valid: null, errors: [{ path: '', message: 'config must be an object' }] };
  }
  const config = data as Record<string, unknown>;
  if (!Array.isArray(config.extensions)) {
    return { valid: null, errors: [{ path: 'extensions', message: 'must be an array' }] };
  }
  const errors: ValidationError[] = [];
  config.extensions.forEach((ext, i) => errors.push(...validateExtension(ext, `extensions[${i}]`)));
  return errors.length > 0 ? { valid: null, errors } : { valid: config as ExtensionsConfig, errors: [] };
}

export function validateExtensionManifest(data: unknown): ValidationResult<ExtensionManifest> {
  const errors = validateExtension(data, '');
  return errors.length > 0 ? { valid: null, errors } : { valid: data as ExtensionManifest, errors: [] };
}
