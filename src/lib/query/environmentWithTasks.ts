import { gql } from '@apollo/client';

export default gql`
  query getEnvironment($kubernetesNamespaceName: String!, $limit: Int) {
    environment: environmentByKubernetesNamespaceName(kubernetesNamespaceName: $kubernetesNamespaceName) {
      id
      name
      kubernetesNamespaceName
      project {
        id
        name
        problemsUi
        factsUi
        featureApiRoutes
        environments {
          id
          name
        }
      }
      pendingChanges {
        details
      }
      services {
        name
      }
      advancedTasks {
        ... on AdvancedTaskDefinitionCommand {
          id
          type
          name
          description
          environment
          project
          service
          created
          deleted
          confirmationText
          advancedTaskDefinitionArguments {
            id
            name
            displayName
            type
            range
            defaultValue
            optional
          }
        }
        ... on AdvancedTaskDefinitionImage {
          id
          type
          name
          description
          environment
          project
          service
          created
          deleted
          confirmationText
          advancedTaskDefinitionArguments {
            id
            name
            displayName
            type
            range
            defaultValue
            optional
          }
        }
      }
      tasks(limit: $limit) {
        id
        name
        taskName
        status
        created
        started
        completed
        service
        adminOnlyView
      }
    }
  }
`;
