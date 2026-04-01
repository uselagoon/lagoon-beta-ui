import { gql } from '@apollo/client';

export default gql`
  query getProjectCloneStatus($name: String!) {
    project: projectByName(name: $name) {
      id
      name
      clone {
        id
        status
      }
    }
  }
`;
