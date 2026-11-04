import { gql } from '@apollo/client';

export default gql`
  mutation updateProjectWebhookToken($id: Int!, $webhookToken: String!) {
    updateProject(input: { id: $id, patch: { webhookToken: $webhookToken } }) {
      id
      name
      webhookToken
    }
  }
`;
