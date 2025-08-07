'use client';

import { ProjectDetailsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/project-details/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import dayjs from '@/lib/dayjs';
import { CopyToClipboard, DetailStat } from '@uselagoon/ui-library';
import giturlparse from 'git-url-parse';

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

  const gitLink = gitUrlParsed ? `${gitUrlParsed.resource}/${gitUrlParsed.full_name}` : '';
  const formattedDate = dayjs.utc(project.created).local().format('DD MMM YYYY, HH:mm:ss (Z)');
  const developEnvironmentCount = project.environments.filter(env => env.environmentType === 'development').length;

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
      children: project.branches,
      lowercaseValue: true,
    },
    {
      key: 'pulls',
      title: 'PULL REQUESTS ENABLED',
      children: project.pullrequests,
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

  const DetailedStats = detailItems.map(detail => (
    <DetailStat key={detail.key} title={detail.title} value={detail.children} />
  ));
  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Details</h3>
      <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
        Key information about your project
      </span>

      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(370px,1fr))] [&>div[data-slot=card]]:w-full [&>div[data-slot=card]]:max-w-full [&>div[data-slot=card]]:min-w-[370px]">
        {DetailedStats}
      </div>
    </SectionWrapper>
  );
}
