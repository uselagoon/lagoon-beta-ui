import React, { forwardRef, useEffect } from 'react';
import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { Building2, FolderOpen, Home, Settings, HelpCircle, Info, XCircle } from 'lucide-react';

import RootLayout from '../components/RootLayout';
import { LinkProvider as NextLinkProvider } from '../providers/NextLinkProvider';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import DetailStat from '../components/DetailStat';
import UISheet from '../components/Sheet';
import DataTable from '../components/DataTable';
import type { DataTableColumnDef } from '../components/DataTable';
import type { Theme } from '../schemas';
import { buildThemeStyle } from '../lib/theme';

type ThemeArgs = {
  [K in `${'light' | 'dark'}.${string}`]?: string;
};

const MockLink = forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>(({ href, children, ...rest }, ref) => (
  <a ref={ref} href={href} {...rest}>
    {children}
  </a>
));

MockLink.displayName = 'MockLink';

function argsToTheme(args: ThemeArgs): Theme {
  const theme: Theme = {};
  for (const [flatKey, value] of Object.entries(args)) {
    if (!value) continue;
    const dotIndex = flatKey.indexOf('.');
    if (dotIndex === -1) continue;
    const mode = flatKey.slice(0, dotIndex) as 'light' | 'dark';
    const token = flatKey.slice(dotIndex + 1);
    if (mode !== 'light' && mode !== 'dark') continue;
    if (!theme[mode]) theme[mode] = {};
    (theme[mode] as Record<string, string>)[token] = value;
  }
  return theme;
}

type EnvironmentRow = { name: string; type: string; status: string; updated: string };

const environmentData: EnvironmentRow[] = [
  { name: 'main',        type: 'production',  status: 'active',   updated: '2 hours ago' },
  { name: 'staging',     type: 'staging',     status: 'active',   updated: '1 day ago' },
  { name: 'dev',         type: 'development', status: 'active',   updated: '3 hours ago' },
  { name: 'feature-x',  type: 'development', status: 'inactive', updated: '5 days ago' },
  { name: 'hotfix-123', type: 'development', status: 'active',   updated: '30 mins ago' },
  { name: 'sandbox',    type: 'sandbox',     status: 'inactive', updated: '2 weeks ago' },
];

const environmentColumns: DataTableColumnDef<EnvironmentRow>[] = [
  { accessorKey: 'name',    header: 'Name',         width: '30%' },
  { accessorKey: 'type',    header: 'Type',         width: '25%' },
  { accessorKey: 'status',  header: 'Status',       width: '20%' },
  { accessorKey: 'updated', header: 'Last updated', width: '25%' },
];

function ComponentShowcase() {
  return (
    <div className="p-6 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Theme Preview</h1>
        <p className="text-muted-foreground text-sm">
          Use the <strong>Controls</strong> panel below to edit colour tokens and see them applied live across all components.
        </p>
      </div>

      <Separator />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <Separator />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>

      <Separator />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Alerts</h2>
        <div className="space-y-3">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>Your deployment is queued and will start shortly.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Deployment failed</AlertTitle>
            <AlertDescription>Build step exited with code 1. Check your logs.</AlertDescription>
          </Alert>
        </div>
      </section>

      <Separator />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Stats</h2>
        <div className="flex flex-wrap gap-4">
          <DetailStat title="Environments" value={18} />
          <DetailStat title="Deployments" value={142} />
          <DetailStat title="Projects" value={7} />
        </div>
      </section>

      <Separator />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Sheet</h2>
        <UISheet
          sheetTrigger="Edit Project"
          sheetTitle="Edit Project"
          sheetDescription="Update the project configuration."
          sheetFooterButton="Save changes"
          buttonAction={() => {}}
          additionalContent={null}
          error={false}
          sheetFields={[
            { id: 'name',   label: 'Project name', inputDefault: 'my-project' },
            { id: 'branch', label: 'Branch',        inputDefault: 'main' },
          ]}
        />
      </section>

      <Separator />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Data Table</h2>
        <DataTable
          columns={environmentColumns}
          data={environmentData}
          searchableColumns={['name', 'type']}
          searchPlaceholder="Search environments..."
        />
      </section>
    </div>
  );
}


const mockSidenavItems = [
  {
    section: 'Main',
    sectionItems: [
      { title: 'Dashboard', url: '/dashboard', icon: Home },
      {
        title: 'Projects',
        url: '/projects',
        icon: FolderOpen,
        children: [
          { title: 'Project Alpha', url: '/projects/alpha' },
          { title: 'Project Beta', url: '/projects/beta' },
        ],
      },
      {
        title: 'Organisations',
        url: '/organizations',
        icon: Building2,
        children: [
          { title: 'Org 1', url: '/organizations/org-1' },
          { title: 'Org 2', url: '/organizations/org-2' },
        ],
      },
    ],
  },
  {
    section: 'System',
    sectionItems: [
      { title: 'Settings', url: '/settings', icon: Settings },
      { title: 'Help', url: '/help', icon: HelpCircle },
    ],
  },
];

const STYLE_TAG_ID = 'sb-args-theme-override';

const withArgsAsTheme: Decorator<ThemeArgs> = (Story, context) => {
  const theme = argsToTheme(context.args);

  useEffect(() => {
    const hasTheme = (theme.light && Object.keys(theme.light).length > 0) || (theme.dark && Object.keys(theme.dark).length > 0);

    let style = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;

    if (hasTheme) {
      if (!style) {
        style = document.createElement('style');
        style.id = STYLE_TAG_ID;
        document.head.appendChild(style);
      }
      try {
        style.textContent = buildThemeStyle(theme);
      } catch (err) {
        console.warn('[withArgsAsTheme] Rejected unsafe theme token value:', err);
        style.textContent = '';
      }
    } else {
      style?.remove();
    }

    return () => {
      document.getElementById(STYLE_TAG_ID)?.remove();
    };
  }, [JSON.stringify(theme)]);

  return <Story />;
};

const lightDefaults: ThemeArgs = {
  'light.background': '#f2f2f2',
  'light.foreground': '#0c0c0c',
  'light.primary': 'oklch(0.205 0 0)',
  'light.primary-foreground': 'oklch(0.985 0 0)',
  'light.secondary': 'oklch(0.97 0 0)',
  'light.secondary-foreground': 'oklch(0.205 0 0)',
  'light.muted': 'oklch(0.97 0 0)',
  'light.muted-foreground': 'oklch(0.556 0 0)',
  'light.accent': 'oklch(0.97 0 0)',
  'light.accent-foreground': 'oklch(0.205 0 0)',
  'light.destructive': 'oklch(0.577 0.245 27.325)',
  'light.border': 'oklch(0.922 0 0)',
  'light.input': 'oklch(0.922 0 0)',
  'light.ring': 'oklch(0.708 0 0)',
  'light.sidebar': 'oklch(0.985 0 0)',
};

const darkDefaults: ThemeArgs = {
  'dark.background': 'oklch(0.145 0 0)',
  'dark.foreground': 'oklch(0.985 0 0)',
  'dark.primary': 'oklch(0.922 0 0)',
  'dark.primary-foreground': 'oklch(0.205 0 0)',
  'dark.secondary': 'oklch(0.269 0 0)',
  'dark.secondary-foreground': 'oklch(0.985 0 0)',
  'dark.muted': 'oklch(0.269 0 0)',
  'dark.muted-foreground': 'oklch(0.708 0 0)',
  'dark.accent': 'oklch(0.269 0 0)',
  'dark.accent-foreground': 'oklch(0.985 0 0)',
  'dark.destructive': 'oklch(0.704 0.191 22.216)',
  'dark.border': 'oklch(1 0 0 / 10%)',
  'dark.input': 'oklch(1 0 0 / 15%)',
  'dark.ring': 'oklch(0.556 0 0)',
  'dark.sidebar': 'oklch(0.205 0 0)',
};

function buildArgTypes(mode: 'light' | 'dark', tokens: string[]): Meta['argTypes'] {
  return Object.fromEntries(
    tokens.map((token) => [
      `${mode}.${token}`,
      {
        name: `${mode === 'light' ? '☀️' : '🌙'} ${token}`,
        control: 'color',
        table: { category: mode === 'light' ? 'Light mode tokens' : 'Dark mode tokens' },
      },
    ])
  );
}

const tokenList = [
  'background',
  'foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'border',
  'input',
  'ring',
  'sidebar',
];

const meta: Meta<ThemeArgs> = {
  title: 'Theming/Theme Preview',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Live theme editor. Use the **Controls** panel to change CSS token values and see them applied instantly across all components. Copy your final values into `overrides.json` under the `theme` key to apply them to the app.',
      },
    },
  },
  argTypes: {
    ...buildArgTypes('light', tokenList),
    ...buildArgTypes('dark', tokenList),
  },
  decorators: [
    withArgsAsTheme,
    (Story) => (
      <NextLinkProvider linkComponent={MockLink}>
        <Story />
      </NextLinkProvider>
    ),
  ],
  render: (args) => (
    <RootLayout
      userInfo={{ email: 'jane.smith@example.com', name: 'Jane Smith' }}
      appInfo={{ name: 'Lagoon', version: 'v1.0.0', kcUrl: 'https://keycloak.example.com' }}
      sidenavItems={mockSidenavItems}
      signOutFn={async () => {}}
      currentPath="/projects"
    >
      <ComponentShowcase />
    </RootLayout>
  ),
};

export default meta;

type Story = StoryObj<ThemeArgs>;

export const Default: Story = {
  name: 'Default (globals.css values)',
  args: {
    ...lightDefaults,
    ...darkDefaults,
  },
};

export const ExampleBlue: Story = {
  name: 'Example: Example Blue',
  args: {
    ...lightDefaults,
    ...darkDefaults,
    'light.primary': '#3a8cff',
    'light.primary-foreground': '#ffffff',
    'light.ring': '#3a8cff',
    'light.sidebar': '#eef4ff',
    'dark.primary': '#5ba3ff',
    'dark.primary-foreground': '#0c0c0c',
    'dark.ring': '#5ba3ff',
  },
};

export const ExampleGreen: Story = {
  name: 'Example: Example Green',
  args: {
    ...lightDefaults,
    ...darkDefaults,
    'light.primary': '#15803d',
    'light.primary-foreground': '#ffffff',
    'light.ring': '#15803d',
    'light.sidebar': '#f0fdf4',
    'dark.primary': '#34d399',
    'dark.primary-foreground': '#0c0c0c',
    'dark.ring': '#34d399',
  },
};

export const ExamplePurple: Story = {
  name: 'Example: Example Purple',
  args: {
    ...lightDefaults,
    ...darkDefaults,
    'light.primary': '#7e22ce',
    'light.primary-foreground': '#ffffff',
    'light.ring': '#7e22ce',
    'light.sidebar': '#faf5ff',
    'dark.primary': '#c084fc',
    'dark.primary-foreground': '#0c0c0c',
    'dark.ring': '#c084fc',
  },
};
