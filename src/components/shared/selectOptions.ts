const orgUserRoleOptionsConst = [
  {
    label: 'Guest',
    value: 'GUEST',
  },
  {
    label: 'Reporter',
    value: 'REPORTER',
  },
  {
    label: 'Developer',
    value: 'DEVELOPER',
  },
  {
    label: 'Maintainer',
    value: 'MAINTAINER',
  },
  {
    label: 'Owner',
    value: 'OWNER',
  },
] as const;

export type OrgUserRole = (typeof orgUserRoleOptionsConst)[number]['value'];

export const orgUserRoleOptions: { label: string; value: string }[] = [...orgUserRoleOptionsConst];

export const routeTypeOptions = [
  {
    label: 'Standard',
    value: 'STANDARD',
  },
  {
    label: 'Active',
    value: 'ACTIVE',
  },
  {
    label: 'Standby',
    value: 'STANDBY',
  },
];
