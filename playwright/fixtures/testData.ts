
export const BASE_URL = process.env.PW_BASE_URL ?? 'http://172.17.0.1:3003';
export const KEYCLOAK_URL = process.env.PW_KEYCLOAK_URL ?? 'http://172.17.0.1:8088';
export const GRAPHQL_API = process.env.PW_GRAPHQL_API ?? 'http://0.0.0.0:3000/graphql';

export const USERS = {
  guest:         'guest@example.com',
  reporter:      'reporter@example.com',
  developer:     'developer@example.com',
  maintainer:    'maintainer@example.com',
  owner:         'owner@example.com',
  orguser:       'orguser@example.com',
  orgviewer:     'orgviewer@example.com',
  orgadmin:      'orgadmin@example.com',
  orgowner:      'orgowner@example.com',
  platformowner: 'platformowner@example.com',
} as const;

export const SEED = {
  project:      'lagoon-demo',
  organization: 'lagoon-demo-organization',
  environments: {
    production: 'lagoon-demo-main',
    staging:    'lagoon-demo-staging',
  },
  deploymentSlug: 'lagoon-build-7g8h9i',
} as const;

export const variables = {
  name:  'pw-test-variable',
  value: '123456789',
} as const;

export const ssh = {
  name:  'pw-test-ssh-key',
  value: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCqdSQ0y7tT+42qEdPlWniU5IGpBC8zKLq7DozcXSPAIzXVz853wFFOVCOcJSCGw/sF/7DQCgFWEV90uUBTdx0HPG6/i0n6DD92q4wK0tRBvYfBPernQ/iXXQxqO/Gg4b0O76z6PId+/35LoO5qdlfgbcAtn4b/ry9WF8hSar4az2qxgcpRVg4TpvFtvBX/ChxcmFzJRk0yWr4B+qEdLjaqJcobCgqcJoWYoIioUWEttX9Muz36Mst59ibqIDygI1kOGqQ7nf3AAVcMPoy7UdvkGD4lsi/Ibbi/8yRdlCzGoHBmTFV/R71XBg+tgN79ztmsxwap0uH1f/WKZRP4HzAd',
} as const;

export const organizations = {
  overview: {
    friendlyName: 'Playwright test org',
    description:  'Playwright test org description',
  },
  groups: {
    newGroupName:  'pw-group1',
    newGroupName2: 'pw-group2',
  },
  users: {
    email: 'orguser@example.com',
    role:  'developer',
  },
  project: {
    projectName: 'pw-drupal-test',
    gitUrl:      'git@github.com:amazeeio/lagoon-demo.git',
    prodEnv:     'main',
  },
  notifications: {
    slack: {
      name:    'pw-slack-notification-1',
      webhook: 'https://hooks.slack.com/services/pw-webhook-1',
      channel: 'pw-slack-channel-1',
    },
    email: {
      name:  'pw-email-notification-1',
      email: 'pw-email-1@example.com',
    },
  },
  manage: {
    user: 'orguser@example.com',
  },
} as const;
