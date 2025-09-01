import { gql } from '@apollo/client';

export default gql`
  query getEnvironment($environmentID: Int!) {
    environment: environmentById(id: $environmentID) {
      backups {
        backupId
        restore {
          restoreLocation
        }
      }
    }
  }
`;
