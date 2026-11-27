export interface Environment {
  id: number;
  name: string;
  environmentType: string;
  deployType: string;
}

export interface CloneOptions {
  copyData: boolean;
  metadata: boolean;
  groups: boolean;
  notifications: boolean;
  projectVariables: boolean;
  environmentVariables: boolean;
}

export type DialogStep = 'configure' | 'progress' | 'success' | 'error';

export const NAME_PATTERN = /^[a-z][a-z0-9-]*$/;

export function validateName(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Project name is required';
  if (!NAME_PATTERN.test(trimmed))
    return 'Use only lowercase letters, numbers, and hyphens. Must start with a letter.';
  return null;
}

export const CLONE_OPTIONS_CONFIG = [
  {
    key: 'copyData' as const,
    label: 'Copy Data',
    description: 'Copy database content',
  },
  {
    key: 'metadata' as const,
    label: 'Project Metadata',
    description: 'Copy project metadata key-value pairs',
  },
  {
    key: 'groups' as const,
    label: 'Project Groups',
    description: 'Copy group associations',
  },
  {
    key: 'notifications' as const,
    label: 'Project Notifications',
    description: 'Copy notification configurations',
  },
  {
    key: 'projectVariables' as const,
    label: 'Project Variables',
    description: 'Copy project-level environment variables',
  },
  {
    key: 'environmentVariables' as const,
    label: 'Environment Variables',
    description: 'Copy environment-specific variables',
  },
] as const;
