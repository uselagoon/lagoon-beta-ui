import { gql } from '@apollo/client';

export default gql`
  query getProjectRestrictions($name: String!) {
    project: projectByName(name: $name) {
      id
      name
      restrictions
      clone {
        id
        status
      }
    }
  }
`;
