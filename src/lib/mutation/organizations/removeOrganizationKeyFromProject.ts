import { gql } from '@apollo/client';

export default gql`
  mutation removeOrganizationKeyFromProject($id: Int!, $project: String!) {
    removeOrganizationKeyFromProject(id: $id, project: $project) {
      id
    }
  }
`;