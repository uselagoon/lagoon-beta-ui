import { gql } from '@apollo/client';

export default gql`
  mutation updateUser(
    $email: String!
    $sshKeyChanges: Boolean!
    $groupRoleChanges: Boolean!
    $organizationRoleChanges: Boolean!
  ) {
    updateUser(
      input: {
        user: { email: $email }
        patch: {
          emailNotifications: {
            sshKeyChanges: $sshKeyChanges
            groupRoleChanges: $groupRoleChanges
            organizationRoleChanges: $organizationRoleChanges
          }
        }
      }
    ) {
      email
      emailNotifications {
        sshKeyChanges
        groupRoleChanges
        organizationRoleChanges
      }
    }
  }
`;
