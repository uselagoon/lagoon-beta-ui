import { gql } from '@apollo/client';

export default gql`
  query getOrganization($name: String!) {
    organization: organizationByName(name: $name) {
      id
      name
      projects {
        id
        name
        clone {
          status
        }
      }
      keys {
        id
        name
        publicKey
        comment
        created
        projects {
          id
          name
        }
      }
    }
  }
`;
