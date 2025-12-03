'use client';

import React, { startTransition, useEffect, useState } from 'react';

import { useEnvContext } from 'next-runtime-env';
import { usePathname } from 'next/navigation';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import EnvironmentNotFound from '@/components/errors/EnvironmentNotFound';
import { usePendingChangesNotification } from '@/hooks/usePendingChangesNotification';
import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { DataTable, SelectWithOptions } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

import { TasksData } from '../../../app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/tasks/(tasks-page)/page';
import getTasksTableColumns from './_components/TableColumns';
import { getDefaultTaskOptions } from './_components/defaultTaskOptions';
import DrushArchiveDump from './_components/tasks/DrushArchiveDump';
import DrushCacheClear from './_components/tasks/DrushCacheClear';
import DrushCron from './_components/tasks/DrushCron';
import DrushRsyncFiles from './_components/tasks/DrushRsyncFiles';
import DrushSqlDump from './_components/tasks/DrushSqlDump';
import DrushSqlSync from './_components/tasks/DrushSqlSync';
import DrushUserLogin from './_components/tasks/DrushUserLogin';
import InvokeRegisteredTask, { AdvancedTaskType } from './_components/tasks/InvokeRegisteredTask';
import { tasksFilterOptions } from './_components/filterValues';

type TaskType =
  | 'DrushCacheClear'
  | 'DrushCron'
  | 'DrushSqlSync'
  | 'DrushRsyncFiles'
  | 'DrushSqlDump'
  | 'DrushArchiveDump'
  | 'DrushUserLogin'
  | 'InvokeRegisteredTask';

export default function TasksPage({
  queryRef,
  environmentSlug,
}: {
  queryRef: QueryRef<TasksData>;
  environmentSlug: string;
}) {
  const { refetch } = useQueryRefHandlers(queryRef);

  const {
    data: { environment },
  } = useReadQuery(queryRef);

  // Show notification for pending changes
  usePendingChangesNotification({
    environment,
    environmentSlug,
  });

  const pathname = usePathname();

  const [{ tasks_count }, setQuery] = useQueryStates({
    tasks_count: {
      defaultValue: 10,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : 10),
    },
  });

  const setTasksCount = (val: string) => {
    setQuery({ tasks_count: Number(val) });
  };
  const [isPaginationDisabled, setIsPaginationDisabled] = React.useState(false);

  const [selectedTask, setSelectedTask] = useState<TaskType>();

  const { LAGOON_UI_TASK_BLOCKLIST } = useEnvContext();
  const blockedTasks = JSON.parse(LAGOON_UI_TASK_BLOCKLIST as string) as string[];

  // polling every 20s if status needs to be checked
  useEffect(() => {
    const shouldPoll = environment?.tasks?.some(({ status }) =>
      ['new', 'pending', 'queued', 'running'].includes(status)
    );
    if (shouldPoll) {
      const intId = setInterval(() => {
        startTransition(async () => {
          await refetch();
        });
      }, 20000);

      return () => clearInterval(intId);
    }
  }, [environment?.tasks, refetch]);

  if (!environment) {
    return <EnvironmentNotFound openshiftProjectName={environmentSlug} />;
  }

  const advancedTasks = environment?.advancedTasks?.map(task => {
    const commandstring = task.command ? `[${task.command}]` : '';
    const label = task.description ? `${task.description} ${commandstring}` : '';
    return {
      id: task.id,
      label,
      value: 'InvokeRegisteredTask',
      arguments: task.advancedTaskDefinitionArguments,
      confirmationText: task.confirmationText,
    };
  });

  const defaultTasksMap = {
    DrushCacheClear,
    DrushCron,
    DrushSqlSync,
    DrushRsyncFiles,
    DrushSqlDump,
    DrushArchiveDump,
    DrushUserLogin,
  };

  // returns default task options treeData + advancedTasks(if any)
  const taskoptions = getDefaultTaskOptions(advancedTasks, blockedTasks);

  const advancedTasksWithOptions = taskoptions[1]?.options;

  // options stores advanced task with options
  const selectedAdvancedTaskWithArgs = advancedTasksWithOptions?.find(advTask => advTask.value === selectedTask);

  const allButCurrentEnvironments = environment.project.environments.filter(env => env.id !== environment.id);

  const sharedTaskProps = {
    environment,
    allButCurrentEnvironments,
    refetch,
  };

  const NewTask = defaultTasksMap[selectedTask as keyof typeof defaultTasksMap];

  let isAdvancedTask = false;

  // nothing found, find out if its an advanced task and use <InvokeRegisteredTask/>
  if (!NewTask && selectedTask?.startsWith('InvokeRegisteredTask') && selectedAdvancedTaskWithArgs) {
    isAdvancedTask = true;
  }

  // returns the computed task to run -> default task or advanced
  const renderTask = () => {
    if (!selectedTask) return;

    if (isAdvancedTask) {
      return (
        <InvokeRegisteredTask
          {...sharedTaskProps}
          advancedTask={selectedAdvancedTaskWithArgs as unknown as AdvancedTaskType}
        />
      );
    }

    return <NewTask {...sharedTaskProps} />;
  };

  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Available Tasks</h3>
      <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
        Run a task on this environment
      </span>

      <div className="mb-4" data-cy="task-select">
        <SelectWithOptions
          options={taskoptions}
          onValueChange={val => {
            setSelectedTask(val as TaskType);
          }}
          placeholder="Select a task to run"
        />
      </div>

      <div className="mb-4 max-w-[100%]">{renderTask()}</div>

      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Recent Task Activity</h3>

      <DataTable
        columns={getTasksTableColumns(pathname, environment.project.id, environment.id)}
        data={environment.tasks}
        disablePagination={isPaginationDisabled}
        renderFilters={table => (
          <SelectWithOptions
            options={tasksFilterOptions}
            width={100}
            value={isPaginationDisabled ? 'all' : String(tasks_count ?? 10)}
            placeholder="Results per page"
            onValueChange={newVal => {
              const size = newVal === 'all' ? table.getRowCount() : Number(newVal);
              setIsPaginationDisabled(newVal === 'all');
              table.setPageSize(size);
              setQuery({ tasks_count: size });
            }}
          />
        )}
      />
    </SectionWrapper>
  );
}
