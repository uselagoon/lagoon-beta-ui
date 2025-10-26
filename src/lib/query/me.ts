import { gql } from '@apollo/client';

export default gql`
  query me {
    me {
      id
      firstName
      lastName
      email
      emailNotifications {
        sshKeyChanges
        groupRoleChanges
        organizationRoleChanges
      }
      sshKeys {
        id
        name
        keyType
        keyValue
        created
        lastUsed
        keyFingerprint
      }
      has2faEnabled
      isFederatedUser
    }
  }
`;
