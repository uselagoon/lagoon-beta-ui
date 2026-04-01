import { gql } from '@apollo/client';

export default gql`
  query getProjectEnvironmentsForClone($name: String!) {
    project: projectByName(name: $name) {
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
