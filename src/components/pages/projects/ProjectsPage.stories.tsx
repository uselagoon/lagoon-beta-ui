import type { Meta, StoryObj } from '@storybook/react';

import { ProjectType, ProjectsData } from '@/app/(routegroups)/(projectroutes)/projects/(projects-page)/page';

import ProjectsPage from './ProjectsPage';

const generateMockProjects = (count: number = 10): ProjectType[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `project-${['alpha', 'beta', 'gamma', 'delta', 'epsilon'][index % 5]}-${index + 1}`,
    problemsUi: index % 3 === 0 ? null : index % 5,
    factsUi: index % 2 === 0 ? 1 : null,
    created: new Date(Date.now() - index * 86400000 * 30).toISOString(),
    gitUrl: `git@github.com:example/project-${index + 1}.git`,
    productionEnvironment: 'main',
    environments: [
      {
        name: 'main',
        route: `https://project-${index + 1}.example.com`,
        updated: new Date(Date.now() - index * 86400000).toISOString(),
        kubernetes: {
          id: 1,
          name: 'prod-cluster',
          cloudRegion: ['US', 'EU', 'APAC'][index % 3],
        },
      },
    ],
  }));
};

const mockProjectsData: ProjectsData = {
  allProjects: generateMockProjects(15),
};

const meta: Meta<typeof ProjectsPage> = {
  title: 'Pages/Projects',
  component: ProjectsPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProjectsPage>;

export const Default: Story = {
  args: {
    data: mockProjectsData,
  },
};

export const Empty: Story = {
  args: {
    data: {
      allProjects: [],
    },
  },
};

export const SingleProject: Story = {
  args: {
    data: {
      allProjects: generateMockProjects(1),
    },
  },
};

export const ManyProjects: Story = {
  args: {
    data: {
      allProjects: generateMockProjects(50),
    },
  },
};
