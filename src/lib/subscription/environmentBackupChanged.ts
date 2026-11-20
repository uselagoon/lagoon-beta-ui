import { gql } from '@apollo/client';

export const backupChangedFragment = gql`
  fragment BackupChangedFields on Backup {
    id
    source
    backupId
    created
    deleted
    restore {
      id
      status
      restoreSize
    }
  }
`;

export default gql`
  subscription subscribeToBackups($environment: Int!) {
    backupChanged(environment: $environment) {
      ...BackupChangedFields
    }
  }
  ${backupChangedFragment}
`;
