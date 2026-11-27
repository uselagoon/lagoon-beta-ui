import { gql } from '@apollo/client';

export default gql`
  mutation updateOrganizationKey($id: Int!, $comment: String!) {
    updateOrganizationKey(id: $id, comment: $comment) {
      id
    }
  }
`;