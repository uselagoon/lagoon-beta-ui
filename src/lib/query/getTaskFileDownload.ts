import { gql } from '@apollo/client';

export default gql`
  query getTask($taskName: String!) {
    taskByTaskName(taskName: $taskName) {
      id
      files {
        id
        filename
        download
      }
    }
  }
`;
