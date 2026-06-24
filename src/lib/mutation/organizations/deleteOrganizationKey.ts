import { gql } from '@apollo/client';

export default gql`
  mutation deleteOrganizationKey($id: Int!) {
    deleteOrganizationKey(id: $id)
  }
`;
