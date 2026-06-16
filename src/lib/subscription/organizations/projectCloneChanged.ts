import { gql } from '@apollo/client';

export default gql`
  subscription projectCloneChanged($project: String!) {
    projectCloneChanged(project: $project) {
      id
      status
      destinationProject {
        name
      }
    }
  }
`;
