import { gql } from '@apollo/client';

export default gql`
  query getProjectWebhookToken($name: String!) {
    webhookToken: getProjectWebhookToken(name: $name)
  }
`;