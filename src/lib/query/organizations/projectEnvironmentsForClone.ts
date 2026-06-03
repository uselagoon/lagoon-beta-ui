import { gql } from '@apollo/client';

export default gql`
  query getProjectEnvironmentsForClone($name: String!) {
    project: orgProjectByName(name: $name) {
      id
      name
      environments {
        id
        name
        environmentType
        deployType
      }
    }
  }
`;
