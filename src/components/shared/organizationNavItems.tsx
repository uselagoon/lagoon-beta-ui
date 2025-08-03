export const organizationNavItems = (orgSlug: string) => [
  {
    key: `/organizations/${orgSlug}`,
    label: 'Overview',
  },
  {
    key: `/organizations/${orgSlug}/groups`,
    label: 'Groups',
  },
  {
    key: `/organizations/${orgSlug}/users`,
    label: 'Users',
  },
  {
    key: `/organizations/${orgSlug}/projects`,
    label: 'Projects',
  },
  {
    key: `/organizations/${orgSlug}/variables`,
    label: 'Variables',
  },
  {
    key: `/organizations/${orgSlug}/notifications`,
    label: 'Notifications',
  },
  {
    key: `/organizations/${orgSlug}/manage`,
    label: 'Administration',
  },
];
