import { gql } from '@apollo/client';

export default gql`
  mutation updateProject($id: Int!) {
    updateProject(input: { id: $id, patch: { webhookToken: "" } }) {
      id
      name
      webhookToken
    }
  }
`;
