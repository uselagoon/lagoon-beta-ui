import { gql } from '@apollo/client';

export default gql`
  mutation ($domain: String!
    $environment: String!
    $project: String!
    $service: String!
    $primary: Boolean
    $type: RouteType
  ) {
    addOrUpdateRouteOnEnvironment(input: {
      domain: $domain
      environment: $environment
      project: $project
      service: $service
      primary: $primary
      type: $type
    }) {
      id
    }
  }
`;
