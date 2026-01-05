import { graphql, HttpResponse } from 'msw';

import {
  MockAllProjects,
  getOrganization,
} from './api';
import { generateOrganizationManageByRole } from './mocks';
import { getCurrentRole } from './roleStore';

const lagoonGraphQL = graphql.link('*');

export const handlers = [
  lagoonGraphQL.query('allProjects', () => {
    return HttpResponse.json({
      data: {
        allProjects: MockAllProjects(123),
      },
    });
  }),

  lagoonGraphQL.query('organizationByName', ({ variables }) => {
    const org = getOrganization();
    return HttpResponse.json({
      data: {
        organization: {
          ...org,
          name: variables.name || org.name,
        },
      },
    });
  }),

  lagoonGraphQL.query('getOrganization', ({ variables }) => {
    const role = getCurrentRole();
    const orgData = generateOrganizationManageByRole(role, variables.name);
    return HttpResponse.json({
      data: {
        organization: orgData,
      },
    });
  }),

  lagoonGraphQL.query('getOrg', ({ variables }) => {
    return HttpResponse.json({
      data: {
        organization: {
          id: 1,
          name: variables.name,
          envVariables: [
            { id: 1, name: 'API_KEY', scope: 'GLOBAL' },
            { id: 2, name: 'DATABASE_URL', scope: 'BUILD' },
            { id: 3, name: 'CACHE_TTL', scope: 'RUNTIME' },
          ],
        },
      },
    });
  }),

  lagoonGraphQL.query('getOrgWithValues', ({ variables }) => {
    const role = getCurrentRole();

    if (role === 'viewer') {
      return HttpResponse.json({
        errors: [{ message: 'Unauthorized: You do not have permission to view variable values' }],
      });
    }

    return HttpResponse.json({
      data: {
        organization: {
          id: 1,
          name: variables.name,
          envVariables: [
            { id: 1, name: 'API_KEY', value: 'secret-api-key-123', scope: 'GLOBAL' },
            { id: 2, name: 'DATABASE_URL', value: 'postgres://localhost/db', scope: 'BUILD' },
            { id: 3, name: 'CACHE_TTL', value: '3600', scope: 'RUNTIME' },
          ],
        },
      },
    });
  }),

  lagoonGraphQL.query('me', () => {
    return HttpResponse.json({
      data: {
        me: {
          id: '1',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          sshKeys: [],
          __typename: 'User',
        },
      },
    });
  }),
];
