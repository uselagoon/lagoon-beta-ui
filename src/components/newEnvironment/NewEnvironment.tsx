import { FC, startTransition, useReducer } from 'react';

import { useEnvContext } from 'next-runtime-env';

import deployEnvironmentBranch from '@/lib/mutation/deployEnvironmentBranch';
import projectByNameWithDeployKeyQuery from '@/lib/query/projectByNameWithDeployKeyQuery';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { Accordion, CopyToClipboard, Input, Sheet } from '@uselagoon/ui-library';
import { toast } from 'sonner';

type Props = {
  projectName: string;
  refetch: () => void;
};
export const NewEnvironment: FC<Props> = ({ projectName, refetch }) => {
  const { error, data: deployKeyValue } = useQuery(projectByNameWithDeployKeyQuery, {
    variables: { name: projectName },
  });

  const [key, forceUpdate] = useReducer(x => x + 1, 0);

  const [deployEnvironmentBranchMutation, { data, loading }] = useMutation(deployEnvironmentBranch, {
    variables: {
      project: projectName,
    },
    onError: err => {
      console.error(err);
      toast.error('Error', {
        description: err.message,
      });
    },
  });

  let dkValue = '';
  if (deployKeyValue) {
    dkValue = deployKeyValue.project.publicKey;
  }

  if (error) console.error(error);

  const { WEBHOOK_URL } = useEnvContext();

  const webhookURL = WEBHOOK_URL ? WEBHOOK_URL : 'https://webhook-handler.example.com';

  const createEnvironment = async (branch_name: string) => {
    try {
      await deployEnvironmentBranchMutation({
        variables: {
          branch: branch_name,
        },
      });

      startTransition(() => {
        refetch();
      });
    } catch (err) {
      console.error(err);
      toast.error('Error', {
        description: (err as ApolloError).message,
      });
    }
    forceUpdate();
  };

  const accordionItems = [
    {
      id: 'deploy_key',
      trigger: 'Do you need to add a Deploy key to your Git service?',
      content: (
        <div className="flex flex-col gap-2">
          <div data-id="copy" className="border p-2 text-black  border-white bg-gray-50 rounded-sm">
            <CopyToClipboard type="hiddenWithIcon" withToolTip text={dkValue} width={250} />
          </div>
          Add this project's Deploy Key to your Git service. A Deploy key is used to access a repository from an
          external host eg Lagoon. Each Git provider has a slightly different process, please follow your providers
          guide:
          <section className="flex flex-col gap-1 [&_a]:underline [&_a]:text-sm [&_a]:leading-[20px]">
            <a
              target="_blank"
              href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys#deploy-keys"
            >
              GitHub
            </a>
            <a target="_blank" href="https://docs.gitlab.com/ee/user/project/deploy_keys/">
              GitLab
            </a>
            <a target="_blank" href="https://support.atlassian.com/bitbucket-cloud/docs/configure-repository-settings/">
              Bitbucket
            </a>
          </section>
        </div>
      ),
    },
    {
      id: 'webhook',
      trigger: 'Do you need a Webhook to trigger deployments?',
      content: (
        <div className="flex flex-col gap-2">
          <div data-id="webhook" className="border p-2 border-white bg-gray-100 rounded-sm">
            <CopyToClipboard type="visible" text={webhookURL} />
          </div>
          Add the webhook to your Git service. Webhooks allow apps or systems to communicate with each other. Each Git
          provider has a slightly different process, please follow your providers guide:
          <section className="flex flex-col gap-1 [&_a]:underline [&_a]:text-sm [&_a]:leading-[20px]">
            <a target="_blank" href="https://docs.github.com/en/webhooks/using-webhooks/creating-webhooks">
              GitHub
            </a>
            <a target="_blank" href="https://docs.gitlab.com/ee/user/project/integrations/webhooks.html">
              GitLab
            </a>
            <a target="_blank" href="https://support.atlassian.com/bitbucket-cloud/docs/manage-webhooks/">
              Bitbucket
            </a>
          </section>
        </div>
      ),
    },
  ];

  return (
    <>
      <Sheet
        data-cy="create-environment"
        sheetTrigger="New environment"
        sheetTitle="Create a new environment"
        sheetFooterButton="Create"
        sheetDescription="Add the branch you wish to build this environment from. This branch must already exist in your git repository"
        loading={loading}
        error={false}
        additionalContent={
          <Accordion type="multiple" items={accordionItems} secondaryText showArrows={false} showSeparators={false} />
        }
        sheetFields={[
          {
            id: 'branch_name',
            label: 'Branch name',
            placeholder: 'Enter a branch name',
            required: true,
          },
        ]}
        buttonAction={(_, { branch_name }) => {
          createEnvironment(branch_name);
        }}
      />
    </>
  );
};
