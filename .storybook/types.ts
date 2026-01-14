import { OrgUserRole } from '../src/components/shared/selectOptions';

export type UserRole = OrgUserRole;

export interface StoryGlobals {
  userRole: UserRole;
  theme: 'light' | 'dark' | 'system';
}

export interface MockOrganizationOwner {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  owner: true | null;
  admin: true | null;
  groupRoles: { id: string }[] | null;
}

export interface MockOrganization {
  id: number;
  name: string;
  description: string;
  friendlyName: string;
  quotaProject: number;
  quotaGroup: number;
  quotaNotification: number;
  quotaEnvironment: number;
  owners: MockOrganizationOwner[];
}

export interface MockProject {
  id: string;
  name: string;
  __typename: 'Project';
  environments: {
    route: string;
    __typename: 'Environment';
    openshift?: {
      friendlyName: string;
      cloudRegion: string;
    };
  }[];
}
