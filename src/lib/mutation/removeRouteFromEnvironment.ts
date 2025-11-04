import { gql } from '@apollo/client';

export default gql`
  mutation ($domain: String!
    $environment: String!
    $project: String!
  ) {
    removeRouteFromEnvironment(input: {
      domain: $domain
      environment: $environment
      project: $project
    }) {
      id
    }
  }
`;
