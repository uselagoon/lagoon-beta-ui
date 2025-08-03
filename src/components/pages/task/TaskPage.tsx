'use client';

import { startTransition, useEffect, useState } from 'react';

import { TaskData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/tasks/[taskSlug]/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import TaskNotFound from '@/components/errors/TaskNotFound';
import { getTaskDuration } from '@/components/utils';
import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { Badge, BasicTable, Switch } from '@uselagoon/ui-library';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

import BackButton from '../../backButton/BackButton';
import CancelTask from '../../cancelTask/CancelTask';
import LogViewer from '../../logViewer/LogViewer';

dayjs.extend(relativeTime);
dayjs.extend(utc);

export const taskColumns = [
  {
    title: 'Task name ',
    dataIndex: 'taskName',
    key: 'taskName',
  },
  {
    title: 'Service ',
    dataIndex: 'service',
    key: 'service',
  },
  {
    title: 'Created ',
    dataIndex: 'created',
    key: 'created',
  },
  {
    title: 'Duration ',
    dataIndex: 'duration',
    key: 'duration',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },

  {
    title: 'Actions',
    key: 'actions',
    dataIndex: 'actons',
  },
];

export default function TaskPage({ queryRef, taskName }: { queryRef: QueryRef<TaskData>; taskName: string }) {
  const { refetch } = useQueryRefHandlers(queryRef);

  const {
    data: { environment },
  } = useReadQuery(queryRef);

  const currentTask = environment && environment.tasks[0];

  const [showParsed, setShowParsed] = useState(true);
  const [showSuccessSteps, setShowSuccessSteps] = useState(true);
  const [highlightWarnings, setHighlightWarnings] = useState(true);

  const handleShowParsed = (checked: boolean) => {
    // disable fields that don't make sense for raw logs
    setShowParsed(checked);
    setShowSuccessSteps(checked);
    setHighlightWarnings(checked);
  };

  // polling every 20s if status needs to be checked
  useEffect(() => {
    const shouldPoll = ['new', 'pending', 'queued', 'running'].includes(currentTask?.status);

    if (shouldPoll) {
      const intId = setInterval(() => {
        startTransition(async () => {
          await refetch();
        });
      }, 20000);

      return () => clearInterval(intId);
    }
  }, [currentTask, refetch]);

  if (!environment?.tasks.length) {
    return <TaskNotFound taskName={taskName} />;
  }
  const taskDataRow = {
    name: currentTask.name,
    service: currentTask.service,
    created: dayjs.utc(currentTask.created).local().fromNow(),
    duration: getTaskDuration(currentTask),
    status: <Badge variant="default">{currentTask.status}</Badge>,

    actions: ['new', 'pending', 'queued', 'running'].includes(currentTask.status) && (
      <CancelTask task={currentTask} projectId={environment.project.id} environmentId={environment.id} />
    ),
    key: String(currentTask.id),
  };

  return (
    <SectionWrapper>
      <BackButton />

      <section className="flex gap-6 mb-4">
        <div className="flex gap-4">
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
      <BasicTable className="border rounded-md mb-4" columns={taskColumns} data={[taskDataRow]} />
      <LogViewer
        logs={currentTask.logs || null}
        status={currentTask.status}
        showParsed={showParsed}
        highlightWarnings={highlightWarnings}
        showSuccessSteps={showSuccessSteps}
        forceLastSectionOpen={true}
        logsTarget="task"
        taskDuration={getTaskDuration(currentTask)}
      />
    </SectionWrapper>
  );
}
