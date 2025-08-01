'use client';

import { ProjectDeployTargetsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/deploy-targets/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { BasicTable, Table } from '@uselagoon/ui-library';

interface ProjectDetailsProps {
  project: ProjectDeployTargetsData['project'];
}

export default function ProjectDeployTargetsPage(props: ProjectDetailsProps) {
  const { project } = props;

  const deployTargetColumns = [
    {
      title: 'Deploy Target Name',
      dataIndex: 'name',
      key: 'deploy_target_name',
    },
    {
      title: 'Branches Enabled ',
      dataIndex: 'branches',
      key: 'branches_enabled',
    },

    {
      title: 'Pull Requests Enabled',
      key: 'pull_requests_enabled',
      dataIndex: 'pullRequests',
    },
  ];

  const deployTargetData = project.deployTargetConfigs.map(depTarget => {
    return {
      name:
        depTarget.deployTarget.friendlyName != null ? depTarget.deployTarget.friendlyName : depTarget.deployTarget.name,
      branches: depTarget.branches,
      pullRequests: depTarget.pullrequests,
      key: depTarget.deployTarget.name,
    };
  });

  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-5">Deploy targets</h3>
      <div className="rounded-md border">
        <BasicTable columns={deployTargetColumns} data={deployTargetData} />
      </div>
    </SectionWrapper>
  );
}
