import { gql } from '@apollo/client';

export default gql`
  mutation addOrganizationKey($organization: String!, $name: String!, $comment: String) {
    addOrganizationKey(input: { organization: $organization, name: $name, comment: $comment }) {
      id
      name
      publicKey
      comment
      created
    }
  }
`;
