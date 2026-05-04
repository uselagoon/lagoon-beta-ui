import { gql } from '@apollo/client';

export default gql`
  query AllProjectsQuery {
    allProjects {
      id
      name
      problemsUi
      factsUi
      created
      gitUrl
      productionEnvironment
      environments(type: PRODUCTION) {
        name
        route
        deployments(limit: 1) {
          created
        }
        kubernetes {
          id
          name
          cloudRegion
        }
      }
    }
  }
`;
