import { gql } from '@apollo/client';

export default gql`
  query getProjectCloneStatus($name: String!) {
    project: orgProjectByName(name: $name) {
      id
      name
      clone {
        id
        status
      }
    }
  }
`;
