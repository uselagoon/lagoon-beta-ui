'use client';

import { ProjectDetailsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/project-details/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import dayjs from '@/lib/dayjs';
import { CopyToClipboard, DetailStat, Skeleton } from '@/ui-library';
import giturlparse from 'git-url-parse';
import { ExtensionZoneRenderer } from '@/components/extensions/ExtensionZoneRenderer';
import { CircleX, TriangleAlert } from 'lucide-react';
import { DeleteConfirm } from '@/components/deleteConfirm/DeleteConfirm';
import { useMutation } from '@apollo/client';
import removeTokenFromProject from '@/lib/mutation/removeTokenFromProject';
import updateProjectWebhookToken from '@/lib/mutation/updateProjectWebhookToken';
import { useWHTokenPermission } from '@/hooks/useWHTokenPermission';
import { RegenerateWebhookToken } from '@/components/regenerateWebhookToken/RegenerateWebhookToken';
import { toast } from 'sonner';
import { HighlightedText } from '@/components/cancelDeployment/styles';

interface ProjectDetailsProps {
  project: ProjectDetailsData['project'];
}

export default function ProjectDetailsPage(props: ProjectDetailsProps) {
  const { project } = props;
  let gitUrlParsed;
  try {
    gitUrlParsed = giturlparse(project.gitUrl);
  } catch {
    gitUrlParsed = null;
  }

  // temporary workaround until we can properly surface permissions in the UI
  const { webhookToken, loading: tokenLoading, denied: tokenDenied, refetch: refetchToken, } = useWHTokenPermission(project.name);

  const [removeTokenFromProjectMutation, { data, loading: deleteLoading }] = useMutation(removeTokenFromProject, {
    onCompleted: () => {
      toast.success('Removed webhook token successfully');
      refetchToken();
    },
  });

  const [updateWebhookTokenMutation, { loading: regenerateLoading }] = useMutation(updateProjectWebhookToken, {
    onCompleted: () => {
      toast.success('Generated webhook token successfully');
      refetchToken();
    },
  });

  const hasWebhookToken = webhookToken != null && webhookToken !== '';
  const viewToken = !tokenDenied;

  const gitLink = gitUrlParsed ? `${gitUrlParsed.resource}/${gitUrlParsed.full_name}` : '';
  const formattedDate = dayjs.utc(project.created).local().format('DD MMM YYYY, HH:mm:ss (Z)');
  const developEnvironmentCount = project.environments.filter(env => env.environmentType === 'development').length;
  const removeTokenIcon = <CircleX className="w-4 h-4 shrink-0 cursor-pointer text-muted-foreground dark:hover:text-gray-100 hover:text-black transition-colors active:text-gray-300"/>;
  const detailItems = [
    {
      key: 'created',
      title: 'CREATED',
      children: formattedDate,
      lowercaseValue: true,
    },
    {
      key: 'origin',
      title: 'ORIGIN',
      children: (
        <a
          className="break-words text-lg lowercase hover:underline"
          data-cy="gitLink"
          target="_blank"
          href={`https://${gitLink}`}
        >
          {gitLink}
        </a>
      ),
      lowercaseValue: true,
    },
    {
      key: 'giturl',
      title: 'GIT URL',
      children: <CopyToClipboard fontSize="1.15rem" type="visible" withToolTip width={250} text={project.gitUrl} />,
      lowercaseValue: true,
    },
    {
      key: 'branches',
      title: 'BRANCHES ENABLED',
      children: <span className="break-words text-lg">{project.branches}</span>,
      lowercaseValue: true,
    },
    {
      key: 'pulls',
      title: 'PULL REQUESTS ENABLED',
      children: <span className="break-words text-lg">{project.pullrequests}</span>,
      lowercaseValue: true,
    },
    {
      key: 'dev_envs',
      title: 'DEVELOPMENT ENVIRONMENTS IN USE',
      children: (
        <>
          {developEnvironmentCount} of {project.developmentEnvironmentsLimit}{' '}
        </>
      ),
      lowercaseValue: true,
    },
  ];
  detailItems.push({
    key: 'webhook_token',
    title: 'WEBHOOK TOKEN',
    children: tokenLoading ? (
      <Skeleton className="w-[250px] h-8" />
    ) : !viewToken ? (
      <p className="text-sm text-muted-foreground">
        You don't have permission to view the webhook token. Contact your administrator to obtain the relevant permission
      </p>
    ) : (
      <>
        <div className="flex items-center gap-2">
          {hasWebhookToken && (
            <div className="min-w-0 mr-1">
              <CopyToClipboard type="hiddenWithIcon" withToolTip text={webhookToken} />
            </div>
          )}
          <RegenerateWebhookToken
            hasToken={hasWebhookToken}
            loading={regenerateLoading}
            message={
              <span className="block space-y-3">
                <span className="block">
                  This will replace the webhook token for project <HighlightedText>{project.name}</HighlightedText>. The current token will stop working immediately, ensure the regenerated token is updated in your Git provider's webhook settings for webhooks to continue functioning.
                </span>
                <span className="block">Are you sure you want to proceed?</span>
              </span>
            }
            onGenerate={webhookToken => updateWebhookTokenMutation({ variables: { id: project.id, webhookToken } })}
          />
          {hasWebhookToken && (
              <DeleteConfirm
                deleteText="Type 'delete' to confirm."
                deleteType="token"
                deleteMessage={
                  <span className="block space-y-2 my-2">
                    <span className="block">
                      This will remove the webhook token from project <HighlightedText>{project.name}</HighlightedText>.
                    </span>
                    <span className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive">
                      <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                      <span>Please note with this action Lagoon will no longer verify incoming webhooks for this project, so unverified webhooks will be accepted.</span>
                    </span>
                    <span className="block">Are you sure you want to proceed?</span>
                  </span>
                }
                icon={removeTokenIcon}
                deleteName="delete"
                loading={deleteLoading}
                action={() => 
                  removeTokenFromProjectMutation({
                     variables: { id: project.id } 
                  })
                }
                renderAsButton={false}
                data={data}
              />
          )}
        </div>
      </>
    ),
    lowercaseValue: true,
  });
  if (project.organizationDetails) {
    detailItems.push({
      key: 'organization',
      title: 'ORGANIZATION',
      children: <span className="break-words text-lg">{project.organizationDetails.friendlyName || project.organizationDetails.name}</span>,
      lowercaseValue: true,
    })
  }
  if (project.autogeneratedRouteConfig) {
    detailItems.push({
      key: 'autogeneratedRoutes',
      title: 'AUTOGENERATED ROUTES',
      children: <span className="break-words text-lg">{project.autogeneratedRouteConfig.enabled.toString()}</span>,
      lowercaseValue: true,
    })
    detailItems.push({
      key: 'autogeneratedRoutesPullrequests',
      title: 'AUTOGENERATED PULLREQUEST ROUTES',
      children: <span className="break-words text-lg">{project.autogeneratedRouteConfig.allowPullRequests.toString()}</span>,
      lowercaseValue: true,
    })
    if (project.autogeneratedRouteConfig.prefixes.length > 0) {
      detailItems.push({
        key: 'autogeneratedRoutePrefixes',
        title: 'AUTOGENERATED ROUTE PREFIXES',
        children: <span className="break-words text-lg">{project.autogeneratedRouteConfig.prefixes.join(',')}</span>,
        lowercaseValue: true,
      })
    }
    if (project.autogeneratedRouteConfig.pathRoutes.length > 0) {
      detailItems.push({
        key: 'autogeneratedPathRoutes',
        title: 'AUTOGENERATED PATH ROUTES',
        children: <span className="break-words text-lg">{JSON.stringify(project.autogeneratedRouteConfig.pathRoutes)}</span>,
        lowercaseValue: true,
      })
    }
  }

  const DetailedStats = detailItems.map(detail => (
    <DetailStat key={detail.key} title={detail.title} value={detail.children} />
  ));
  return (
    <SectionWrapper>
      <ExtensionZoneRenderer zone="project-header" data={{
        projectName: project.name,
        gitUrl: project.gitUrl,
        created: project.created,
      }} />
      <div className="flex items-center justify-between">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Details</h3>
          <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
            Key information about your project
          </span>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(370px,1fr))] [&>div[data-slot=card]]:w-full [&>div[data-slot=card]]:max-w-full [&>div[data-slot=card]]:min-w-[370px]">
        {DetailedStats}
      </div>
      <ExtensionZoneRenderer zone="project-footer" data={{
        projectName: project.name,
        gitUrl: project.gitUrl,
        created: project.created,
      }} />
    </SectionWrapper>
  );
}
