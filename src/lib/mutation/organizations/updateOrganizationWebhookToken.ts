import { gql } from '@apollo/client';

export default gql`
  mutation updateOrganizationWebhookToken($id: Int!, $webhookToken: String!) {
    updateOrganization(input: { id: $id, patch: { webhookToken: $webhookToken } }) {
      id
      name
      webhookToken
    }
  }
`;
