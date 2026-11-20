import { gql } from '@apollo/client';

export const taskChangedFragment = gql`
  fragment TaskChangedFields on Task {
    id
    name
    status
    created
    service
  }
`;

export default gql`
  subscription subscribeToTasks($environment: Int!) {
    taskChanged(environment: $environment) {
      ...TaskChangedFields
    }
  }
  ${taskChangedFragment}
`;
