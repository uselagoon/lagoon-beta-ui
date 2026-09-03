import { gql } from '@apollo/client';

export default gql`
  query getOrganization($name: String!) {
    organization: organizationByName(name: $name) {
      id
      name
      friendlyName
      projects {
        id
        name
        groupCount
        gitUrl
        clone {
          id
          status
        }
      }
      deployTargets {
        id
        name
      }
      featureProjectClone
      keys {
        id
        name
        projects {
          name
        }
      }
    }
  }
`;

export const orgProjectGroupCount = gql`
  query getOrganization($name: String!) {
    organization: organizationByName(name: $name) {
      id
      projects {
        id
        groupCount
      }
    }
  }
`;

export const GET_SINGLE_PROJECT = gql`
  query getOrganization($project: String!) {
    project: orgProjectByName(name: $project) {
      id
      groupCount
    }
  }
`;
