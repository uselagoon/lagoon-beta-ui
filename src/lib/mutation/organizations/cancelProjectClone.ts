import { gql } from '@apollo/client';

export default gql`
  mutation cancelProjectClone($organization: Int!, $cloneId: Int!) {
    cancelProjectClone(input: {organization: $organization, cloneId: $cloneId})
  }
`;