'use client';

import { startTransition, useEffect, useState } from 'react';

import { TaskData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/tasks/[taskSlug]/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import TaskNotFound from '@/components/errors/TaskNotFound';
import { getTaskDuration } from '@/components/utils';
import getTaskFilesDownload from '@/lib/query/getTaskFileDownload';
import { QueryRef, useLazyQuery, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { Badge, BasicTable, Button, Switch } from '@uselagoon/ui-library';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { Download } from 'lucide-react';
import { isValidUrl } from 'utils/isValidUrl';

import BackButton from '../../backButton/BackButton';
import CancelTask from '../../cancelTask/CancelTask';
import LogViewer from '../../logViewer/LogViewer';

dayjs.extend(relativeTime);
dayjs.extend(utc);

type TaskFile = {
  id: number;
  download: string;
  filename: string;
};

type GetTaskFilesDownloadData = {
  taskByTaskName: {
    files: TaskFile[];
  };
};

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

  const [fileDownloads, setFileDownloads] = useState<Record<string, string>>({});
  const [targetFileId, setTargetFileId] = useState<number | null>(null);

  const currentTask = environment && environment.tasks[0];

  const [getFilesDownload, { loading, error }] = useLazyQuery<GetTaskFilesDownloadData>(getTaskFilesDownload, {
    variables: {
      taskName: currentTask.taskName,
    },
    fetchPolicy: 'network-only',
    onCompleted: data => {
      if (!targetFileId || !data) {
        setTargetFileId(null);
        return;
      }
      const allFiles = data.taskByTaskName?.files;
      const targetFile = allFiles?.find(file => file.id === targetFileId);

      if (targetFile?.download && isValidUrl(targetFile.download)) {
        const { id, download } = targetFile;
        setFileDownloads(prevUrls => ({
          ...prevUrls,
          [id]: download,
        }));
        window.open(download, '_blank', 'noopener,noreferrer');
      } else {
        console.error(`Error fetching file download: ${targetFileId}`);
      }
      setTargetFileId(null);
    },
    onError: () => {
      console.error(error);
      setTargetFileId(null);
    },
  });

  const [showParsed, setShowParsed] = useState(true);
  const [showSuccessSteps, setShowSuccessSteps] = useState(true);
  const [highlightWarnings, setHighlightWarnings] = useState(true);

  const handleShowParsed = (checked: boolean) => {
    // disable fields that don't make sense for raw logs
    setShowParsed(checked);
    setShowSuccessSteps(checked);
    setHighlightWarnings(checked);
  };

  const handleDownload = (fileToDownload: TaskFile) => {
    if (loading) return;
    const fileDownload = fileDownloads[fileToDownload.id];

    if (fileDownload) {
      window.open(fileDownload, '_blank', 'noopener,noreferrer');
    } else {
      setTargetFileId(fileToDownload.id);
      void getFilesDownload();
    }
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

      {currentTask.files.length > 0 && (
        <div className="flex flex-col gap-4 my-4">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">Files</h3>
          <ul className="field">
            {currentTask.files.map(file => {
              const { id, filename } = file;
              return (
                <li key={id} className="mb-1 -translate-x-4">
                  <Button
                    className="cursor-pointer hover:text-blue-800"
                    variant="link"
                    onClick={() => handleDownload(file)}
                  >
                    <Download /> {filename}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </SectionWrapper>
  );
}
