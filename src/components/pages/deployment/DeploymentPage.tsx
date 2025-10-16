'use client';

import { startTransition, useEffect, useState } from 'react';

import Link from 'next/link';

import { DeploymentData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/deployments/[deploymentSlug]/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import BackButton from '@/components/backButton/BackButton';
import CancelDeployment from '@/components/cancelDeployment/CancelDeployment';
import DeploymentNotFound from '@/components/errors/DeploymentNotFound';
import LogViewer from '@/components/logViewer/LogViewer';
import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { Badge, BasicTable, Button, Switch, Table } from '@uselagoon/ui-library';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

import { getDeploymentDuration } from '../allDeployments/TableColumns';
import {capitalize} from "@/components/utils";
import {Loader2} from "lucide-react";

dayjs.extend(relativeTime);
dayjs.extend(utc);

export const deploymentColumns = [
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Name / ID ',
    dataIndex: 'name',
    key: 'name',
    columnClassName: 'w-1/4',
  },

  {
    title: 'Timestamp ',
    dataIndex: 'created',
    key: 'created',
  },

  {
    title: 'Duration ',
    dataIndex: 'duration',
    key: 'duration',
  },
  {
    title: 'Actions',
    key: 'actions',
    dataIndex: 'actons',
  },
];
export default function DeploymentPage({
  queryRef,
  deploymentName,
}: {
  queryRef: QueryRef<DeploymentData>;
  deploymentName: string;
}) {
  const { refetch } = useQueryRefHandlers(queryRef);

  const {
    data: { environment },
  } = useReadQuery(queryRef);

  const [showParsed, setShowParsed] = useState(true);
  const [showSuccessSteps, setShowSuccessSteps] = useState(true);
  const [highlightWarnings, setHighlightWarnings] = useState(true);

  const deployment = environment && environment.deployments[0];
  // polling every 20s if status needs to be checked
  useEffect(() => {
    const shouldPoll = ['new', 'pending', 'queued', 'running'].includes(deployment?.status);

    if (shouldPoll) {
      const intId = setInterval(() => {
        startTransition(async () => {
          await refetch();
        });
      }, 20000);

      return () => clearInterval(intId);
    }
  }, [deployment, refetch]);

  if (!environment?.deployments.length) {
    return <DeploymentNotFound deploymentName={deploymentName} />;
  }

  const handleShowParsed = (checked: boolean) => {
    // disable fields that don't make sense for raw logs
    setShowParsed(checked);
    setShowSuccessSteps(checked);
    setHighlightWarnings(checked);
  };

  const deploymentDataRow = {
    status: <Badge variant="default">{capitalize(deployment.status)} {!['complete', 'cancelled', 'failed'].includes(deployment.status) &&
      <Loader2 className="h-4 w-4 animate-spin t"/>}
    </Badge>,
    name: deployment.bulkId ? (
      <section className="flex items-center ">
        <p>{deployment.name}</p>
        <div className="bulk-link bg-blue-400 hover:bg-blue-600 py-1 px-2 translate-x-4/5 mr-3 rounded-sm transition-colors">
          <Link className="text-white" href={`/bulkdeployment/${deployment.bulkId}`}>
            BULK
          </Link>
        </div>
      </section>
    ) : (
      deployment.name
    ),
    created: dayjs.utc(deployment.created).local().fromNow(),
    duration: getDeploymentDuration(deployment),
    key: String(deployment.id),
    actions: ['new', 'pending', 'queued', 'running'].includes(deployment.status) && (
      <CancelDeployment deployment={deployment} />
    ),
  };

  return (
    <SectionWrapper>
      <BackButton />

      <section className="flex gap-6 mb-4 items-center justify-between">
        <div className="flex gap-4">
          <Switch
            label="Show successful steps"
            disabled={!showParsed}
            checked={showSuccessSteps}
            id=""
            description=""
            onCheckedChange={checked => setShowSuccessSteps(checked)}
          />

          <Switch
            label="Highlight warnings"
            disabled={!showParsed}
            checked={highlightWarnings}
            onCheckedChange={checked => setHighlightWarnings(checked)}
            id=""
            description=""
          />

          <Switch
            label="View parsed"
            data-cy="logviewer-toggle"
            checked={showParsed}
            onCheckedChange={checked => handleShowParsed(checked)}
            id=""
            description=""
          />
        </div>
      </section>

      <BasicTable className="border rounded-md mb-4" columns={deploymentColumns} data={[deploymentDataRow]} />
      <LogViewer
        logs={deployment.buildLog}
        status={deployment.status}
        showParsed={showParsed}
        highlightWarnings={highlightWarnings}
        showSuccessSteps={showSuccessSteps}
        forceLastSectionOpen={true}
        logsTarget="deployment"
      />
    </SectionWrapper>
  );
}
