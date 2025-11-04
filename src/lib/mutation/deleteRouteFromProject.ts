import { gql } from '@apollo/client';

export default gql`
  mutation ($id: Int!) {
    deleteRoute(input: {id: $id})
  }
`;
