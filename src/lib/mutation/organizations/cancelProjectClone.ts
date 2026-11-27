import { gql } from '@apollo/client';

export default gql`
  mutation cancelProjectClone($cloneId: Int!, $cleanupClone: Boolean!) {
    cancelProjectClone(input: {cloneId: $cloneId, cleanupClone: $cleanupClone}) {
      id
    }
  }
`;