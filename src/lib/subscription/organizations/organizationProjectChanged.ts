import { gql } from '@apollo/client';

export default gql`
  subscription organizationProjectChanged($organization: String!) {
    organizationProjectChanged(organization: $organization) {
      id
      name
      clone {
        id
        status
      }
    }
  }
`;
