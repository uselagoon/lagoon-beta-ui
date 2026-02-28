export type ExtensionNavTarget =
  | 'sidebar-projects'
  | 'sidebar-deployments'
  | 'sidebar-organizations'
  | 'sidebar-settings';

export type ExtensionSlotLocation =
  | 'project-header'
  | 'project-footer'
  | 'environment-header'
  | 'environment-footer'
  | 'organization-header'
  | 'organization-footer'
  | 'global-header'
  | 'global-footer';

export type ExtensionNavItem = {
  id: string;
  label: string;
  href: string;
  icon?: string;
  target: ExtensionNavTarget;
  position?: 'start' | 'end' | number;
  requiredRoles?: string[];
  excludeRoles?: string[];
};

export type ExtensionSidebarSection = {
  section: string;
  position?: 'start' | 'end' | number;
  requiredRoles?: string[];
  items: Omit<ExtensionNavItem, 'target'>[];
};

export type ExtensionPage = {
  route: string;
  requiredRoles?: string[];
  excludeRoles?: string[];
  accessDeniedRedirect?: string;
};

export type ExtensionSlot = {
  id: string;
  component: string;
  slot: ExtensionSlotLocation;
  props?: Record<string, unknown>;
  requiredRoles?: string[];
};

export type ExtensionManifest = {
  meta: {
    name: string;
    version: string;
    description?: string;
  };
  navigation?: {
    items?: ExtensionNavItem[];
    sections?: ExtensionSidebarSection[];
  };
  pages?: ExtensionPage[];
  slots?: ExtensionSlot[];
  features?: Record<string, boolean>;
};

export type ExtensionsConfig = {
  extensions: ExtensionManifest[];
};
