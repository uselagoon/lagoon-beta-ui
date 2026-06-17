export const env = {
  url:      process.env.PW_BASE_URL      ?? 'http://0.0.0.0:3003',
  api:      process.env.PW_GRAPHQL_API   ?? 'http://0.0.0.0:3000/graphql',
  keycloak: process.env.PW_KEYCLOAK_URL  ?? 'http://172.17.0.1:8088',

  project:            'lagoon-demo',
  organization:       'lagoon-demo-organization',
  env_production:     'lagoon-demo-main',
  env_staging:        'lagoon-demo-staging',

  user_guest:         'guest@example.com',
  user_reporter:      'reporter@example.com',
  user_developer:     'developer@example.com',
  user_maintainer:    'maintainer@example.com',
  user_owner:         'owner@example.com',
  user_orguser:       'orguser@example.com',
  user_orgviewer:     'orgviewer@example.com',
  user_orgadmin:      'orgadmin@example.com',
  user_orgowner:      'orgowner@example.com',
  user_platformowner: 'platformowner@example.com',
} as const;
