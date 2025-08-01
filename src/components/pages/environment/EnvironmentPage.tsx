'use client';

import { useRouter } from 'next/navigation';

import { EnvironmentData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/(environment-overview)/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import EnvironmentNotFound from '@/components/errors/EnvironmentNotFound';
import deleteEnvironment from '@/lib/mutation/deleteEnvironment';
import switchActiveStandby from '@/lib/mutation/switchActiveStandby';
import environmentByOpenShiftProjectNameWithFacts from '@/lib/query/environmentWIthInsightsAndFacts';
import { QueryRef, useMutation, useQuery, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { DetailStat } from '@uselagoon/ui-library';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import gitUrlParse from 'git-url-parse';

import ActiveStandbyConfirm from '../../activestandbyconfirm/ActiveStandbyConfirm';
import DeleteConfirm from '../../deleteConfirm/DeleteConfirm';
import KeyFacts from './_components/KeyFacts';
import LimitedRoutes from './_components/LimitedRoutes';
import deduplicateFacts from './_components/deduplicateFacts';

dayjs.extend(utc);

// active/standby routes
export const createLinks = (routes: string | null) => {
  if (!routes || routes === 'undefined') return;

  return routes.split(',').map(route => (
    <a href={route} target="_blank" key={route}>
      {route}
    </a>
  ));
};

export default function EnvironmentPage({
  queryRef,
  environmentSlug,
}: {
  queryRef: QueryRef<EnvironmentData>;
  environmentSlug: string;
}) {
  const { refetch } = useQueryRefHandlers(queryRef);

  const {
    data: { environment },
  } = useReadQuery(queryRef);

  const {
    data: factsData,
    loading: factsLoading,
    error: factsError,
  } = useQuery(environmentByOpenShiftProjectNameWithFacts, {
    variables: {
      openshiftProjectName: environmentSlug,
    },
  });

  const hasFactViewPermission = !factsError?.message?.includes('Unauthorized');
  const environmentFacts = factsData?.environment?.facts ?? [];

  const router = useRouter();

  const [deleteEnvironmentMutation, { data, loading: deleteLoading }] = useMutation(deleteEnvironment);

  const [switchActiveStandbyMutation, { loading: switchLoading }] = useMutation(switchActiveStandby);

  if (!environment) {
    return <EnvironmentNotFound openshiftProjectName={environmentSlug} />;
  }

  let gitUrlParsed;

  try {
    gitUrlParsed = gitUrlParse(environment.project.gitUrl);
  } catch {
    gitUrlParsed = null;
  }

  const gitBranchLink = gitUrlParsed
    ? `${gitUrlParsed.resource}/${gitUrlParsed.full_name}/${
        environment.deployType === 'branch'
          ? `tree/${environment.name}`
          : `pull/${environment.name.replace(/pr-/i, '')}`
      }`
    : '';

  const keyFacts = deduplicateFacts(environmentFacts);

  const environmentDetailItems = [
    {
      children: environment.environmentType,
      key: 'env_type',
      title: 'Environment type',
      lowercaseValue: true,
    },
    {
      children: environment.deployType,
      key: 'deployment_type',
      title: 'Deployment Type',
      lowercaseValue: true,
    },
    {
      children: dayjs.utc(environment.created).local().format('YYYY-MM-DD HH:mm:ss Z'),
      key: 'created',
      title: 'Created',
      lowercaseValue: true,
    },
    {
      children: dayjs.utc(environment.updated).local().format('YYYY-MM-DD HH:mm:ss Z'),
      key: 'updated',
      title: 'Updated',
      lowercaseValue: true,
    },
    ...(gitBranchLink
      ? [
          {
            children: (
              <a
                className="break-words text-inherit lowercase underline"
                data-cy="source"
                target="_blank"
                href={`https://${gitBranchLink}`}
              >
                {gitBranchLink}
              </a>
            ),
            lowercaseValue: true,
            key: 'source',
            title: 'Source',
          },
        ]
      : []),
  ];

  const routes = createLinks(environment.routes);
  const activeRoutes = createLinks(environment.project.productionRoutes);
  const standbyRoutes = createLinks(environment.project.standbyRoutes);
  const envHasNoRoutes = !routes && !activeRoutes && !standbyRoutes;

  const shouldRenderSwitchActiveStandby =
    environment.project.productionEnvironment &&
    environment.project.standbyProductionEnvironment &&
    environment.environmentType === 'production' &&
    environment.project.standbyProductionEnvironment === environment.name;

  const DetailedStats = environmentDetailItems.map(detail => (
    <DetailStat key={detail.key} title={detail.title} value={detail.children} />
  ));

  const environmentDetails = (
    <>
      <div className="grid grid-cols-3 grid-rows-2 gap-4">{DetailedStats}</div>

      {factsLoading && (
        <div className="mt-5">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">System Details</h3>
          <KeyFacts loading />
        </div>
      )}
      {hasFactViewPermission && keyFacts.length > 0 && (
        <div className="mt-5">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">System Details</h3>
          <KeyFacts keyFacts={keyFacts} />
        </div>
      )}

      <div className="mt-5 [&>section]:flex [&>section]:gap-4">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mb-2">Actions</h4>

        <section className="flex gap-4">
          {shouldRenderSwitchActiveStandby ? (
            <ActiveStandbyConfirm
              activeEnvironment={environment.project.productionEnvironment}
              standbyEnvironment={environment.project.standbyProductionEnvironment}
              action={() =>
                switchActiveStandbyMutation({
                  variables: {
                    input: {
                      project: {
                        name: environment.project.name,
                      },
                    },
                  },
                })
              }
              loading={switchLoading}
            />
          ) : null}

          <DeleteConfirm
            buttonText="Delete"
            deleteType="environment"
            deleteName={environment.name}
            loading={deleteLoading}
            data={data}
            action={() =>
              deleteEnvironmentMutation({
                variables: {
                  input: {
                    name: environment.name,
                    project: environment.project.name,
                  },
                },
              })
                // go back to the refreshed project page
                .then(() => {
                  router.push(`/projects/${environment.project.name}`);
                })
                .then(() => router.refresh())
            }
          />
        </section>
      </div>
    </>
  );

  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Overview</h3>
      <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
        Key information about your environment
      </span>
      <section>{environmentDetails}</section>

      <section className="mt-10 [&>*:not(:first-child)]:mb-2">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-5">Routes</h3>

        <div className="flex justify-start gap-24">
          {routes ? (
            <section>
              <h4 className="scroll-m-20 text-md font-semibold tracking-tight mb-3">Active routes</h4>
              <LimitedRoutes routes={routes} />
            </section>
          ) : null}

          <br />
          {standbyRoutes ? (
            <section>
              <h5 className="scroll-m-20 text-md font-semibold tracking-tight mb-3">Standby routes</h5>
              <LimitedRoutes routes={standbyRoutes} />
            </section>
          ) : null}
        </div>
        {envHasNoRoutes && (
          <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal">
            No routes found for {environment.name}
          </span>
        )}
      </section>
    </SectionWrapper>
  );
}
