import React, { forwardRef } from 'react';

import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { getOrgNav, getProjectNav } from '@/components/dynamicNavigation/DynamicNavigation';
import { SidebarSection } from '@/contexts/AppContext';
import { NextLinkProvider, RootLayout } from '@uselagoon/ui-library';
import { BriefcaseBusiness, FolderGit2, KeyRound, ListChecks, ServerCog } from 'lucide-react';

const onNavigate = action('navigate');

const MockLink = forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>(
  ({ href, children, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onNavigate(href);
      onClick?.(e);
    };

    return (
      <a ref={ref} href={href} onClick={handleClick} {...props}>
        {children}
      </a>
    );
  }
);

type NavigationLevel =
  | 'home'
  | 'active-deployments'
  | 'settings'
  | 'preferences'
  // Project levels
  | 'project'
  | 'project-details'
  | 'project-variables'
  | 'project-routes'
  | 'project-deploy-targets'
  // Environment levels
  | 'environment'
  | 'environment-deployments'
  | 'environment-backups'
  | 'environment-tasks'
  | 'environment-routes'
  | 'environment-problems'
  | 'environment-insights'
  | 'environment-variables'
  // Organization levels
  | 'organization'
  | 'organization-groups'
  | 'organization-users'
  | 'organization-projects'
  | 'organization-variables'
  | 'organization-notifications'
  | 'organization-admin';

const getBaseSidenavItems = (kcUrl: string): SidebarSection[] => [
  {
    section: 'Projects',
    sectionItems: [{ title: 'Projects', url: '/projects', icon: FolderGit2 }],
  },
  {
    section: 'Deployments',
    sectionItems: [{ title: 'Active Deployments', url: '/alldeployments', icon: ServerCog }],
  },
  {
    section: 'Organizations',
    sectionItems: [{ title: 'Organizations', url: '/organizations', icon: BriefcaseBusiness }],
  },
  {
    section: 'Settings',
    sectionItems: [
      { title: 'SSH Keys', url: '/settings', icon: KeyRound },
      { title: 'Preferences', url: '/settings/preferences', icon: ListChecks },
    ],
  },
];

const isProjectLevel = (level: NavigationLevel): boolean =>
  level.startsWith('project') || level.startsWith('environment');

const isEnvironmentLevel = (level: NavigationLevel): boolean =>
  level.startsWith('environment');

const isOrganizationLevel = (level: NavigationLevel): boolean =>
  level.startsWith('organization');

function generateSidenavItems(level: NavigationLevel): SidebarSection[] {
  const items = getBaseSidenavItems('https://keycloak.example.com');

  const mockProjectData = {
    project: {
      id: 1,
      name: 'my-project',
      branches: 'main,develop',
      pullrequests: true,
      created: '2024-01-15T10:30:00Z',
      gitUrl: 'git@github.com:example/my-project.git',
      productionEnvironment: 'main',
      standbyProductionEnvironment: null,
      productionRoutes: 'https://example.com',
      standbyRoutes: null,
      developmentEnvironmentsLimit: 5,
      featureApiRoutes: true,
      deployTargetConfigs: [{ id: 1, branches: 'main', pullrequests: 'true', deployTarget: { id: 1, name: 'prod', friendlyName: 'Production' } }],
      environments: [{ environmentType: 'production' as const }],
    },
  };

  const mockEnvironmentData = {
    environment: {
      id: '1',
      name: 'main',
      openshiftProjectName: 'my-project-main',
      project: {
        id: '1',
        name: 'my-project',
        problemsUi: 1,
        factsUi: 1,
        featureApiRoutes: true,
      },
      problems: [],
    },
  };

  if (isProjectLevel(level)) {
    const showEnvNav = isEnvironmentLevel(level);
    const projectChildren = getProjectNav(
      'my-project',
      showEnvNav ? 'my-project-main' : undefined,
      mockProjectData,
      showEnvNav ? mockEnvironmentData : undefined,
      false,
      false
    );
    items[0].sectionItems[0].children = projectChildren;
  }

  if (isOrganizationLevel(level)) {
    const orgChildren = getOrgNav('my-org', true);
    items[2].sectionItems[0].children = orgChildren;
  }

  return items;
}

function getPathForLevel(level: NavigationLevel): string {
  const pathMap: Record<NavigationLevel, string> = {
    home: '/projects',
    'active-deployments': '/alldeployments',
    settings: '/settings',
    preferences: '/settings/preferences',
    // Project levels
    project: '/projects/my-project',
    'project-details': '/projects/my-project/project-details',
    'project-variables': '/projects/my-project/project-variables',
    'project-routes': '/projects/my-project/routes',
    'project-deploy-targets': '/projects/my-project/deploy-targets',
    // Environment levels
    environment: '/projects/my-project/my-project-main',
    'environment-deployments': '/projects/my-project/my-project-main/deployments',
    'environment-backups': '/projects/my-project/my-project-main/backups',
    'environment-tasks': '/projects/my-project/my-project-main/tasks',
    'environment-routes': '/projects/my-project/my-project-main/routes',
    'environment-problems': '/projects/my-project/my-project-main/problems',
    'environment-insights': '/projects/my-project/my-project-main/insights',
    'environment-variables': '/projects/my-project/my-project-main/environment-variables',
    // Organization levels
    organization: '/organizations/my-org',
    'organization-groups': '/organizations/my-org/groups',
    'organization-users': '/organizations/my-org/users',
    'organization-projects': '/organizations/my-org/projects',
    'organization-variables': '/organizations/my-org/variables',
    'organization-notifications': '/organizations/my-org/notifications',
    'organization-admin': '/organizations/my-org/manage',
  };
  return pathMap[level];
}

const ContentPlaceholder = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-muted-foreground text-sm w-full h-[400px] flex items-center justify-center">
      <p className="text-xl">Page Content</p>
    </div>
  </div>
);

interface SidebarNavigationDemoProps {
  navigationLevel: NavigationLevel;
}

const SidebarNavigationDemo = ({ navigationLevel }: SidebarNavigationDemoProps) => {
  const sidenavItems = generateSidenavItems(navigationLevel);
  const currentPath = getPathForLevel(navigationLevel);

  const mockUserInfo = {
    name: 'Test User',
    email: 'test@example.com',
    image: undefined,
  };

  const mockAppInfo = {
    name: 'Lagoon',
    version: '2.0.0',
    kcUrl: 'https://keycloak.example.com',
  };

  const mockSignOut = async () => {
    console.log('Sign out clicked');
  };

  return (
    <NextLinkProvider linkComponent={MockLink}>
      <RootLayout
        appInfo={mockAppInfo}
        userInfo={mockUserInfo}
        signOutFn={mockSignOut}
        currentPath={currentPath}
        sidenavItems={sidenavItems}
      >
        <ContentPlaceholder />
      </RootLayout>
    </NextLinkProvider>
  );
};

const navigationLabels: Record<NavigationLevel, string> = {
  home: 'Home: Projects',
  'active-deployments': 'Home: Active Deployments',
  settings: 'Home: Settings',
  preferences: 'Home: Preferences',
  project: 'Project: Environments',
  'project-details': 'Project: Details',
  'project-variables': 'Project: Variables',
  'project-routes': 'Project: Routes',
  'project-deploy-targets': 'Project: Deploy Targets',
  environment: 'Environment: Overview',
  'environment-deployments': 'Environment: Deployments',
  'environment-backups': 'Environment: Backups',
  'environment-tasks': 'Environment: Tasks',
  'environment-routes': 'Environment: Routes',
  'environment-problems': 'Environment: Problems',
  'environment-insights': 'Environment: Insights',
  'environment-variables': 'Environment: Variables',
  organization: 'Organization: Overview',
  'organization-groups': 'Organization: Groups',
  'organization-users': 'Organization: Users',
  'organization-projects': 'Organization: Projects',
  'organization-variables': 'Organization: Variables',
  'organization-notifications': 'Organization: Notifications',
  'organization-admin': 'Organization: Administration',
};

const allNavigationLevels = Object.keys(navigationLabels) as NavigationLevel[];

const meta: Meta<typeof SidebarNavigationDemo> = {
  title: 'Layout/Sidebar Navigation',
  component: SidebarNavigationDemo,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  argTypes: {
    navigationLevel: {
      control: 'inline-radio',
      options: allNavigationLevels,
      mapping: Object.fromEntries(allNavigationLevels.map(level => [level, level])),
      labels: navigationLabels,
    },
  },
};

export default meta;
type Story = StoryObj<typeof SidebarNavigationDemo>;

export const Default: Story = {
  args: { navigationLevel: 'home' },
};
