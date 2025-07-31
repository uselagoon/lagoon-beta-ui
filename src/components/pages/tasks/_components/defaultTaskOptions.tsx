import { AdvancedTaskDefinitionArgument } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/tasks/(tasks-page)/page';

type AdvancedTaskOptions = {
  id: number;
  label: string;
  value: string;
  arguments: AdvancedTaskDefinitionArgument[];
  confirmationText?: string;
};

export const getDefaultTaskOptions = (advancedTasks: AdvancedTaskOptions[] | undefined, blocklist: string[]) => {
  const baseAdvancedTaskOptions: { label: string; value: string; taskValue?: string }[] = [];

  let options = [
    {
      label: 'Run a task',
      options: [
        {
          label: 'Clear Drupal caches [drush cache-clear]',
          value: 'DrushCacheClear',
        },
        {
          label: 'Run Drupal cron [drush cron]',
          value: 'DrushCron',
        },
        {
          label: 'Copy database between environments [drush sql-sync]',
          value: 'DrushSqlSync',
        },
        {
          label: 'Copy files between environments [drush rsync]',
          value: 'DrushRsyncFiles',
        },
        {
          label: 'Generate database backup [drush sql-dump]',
          value: 'DrushSqlDump',
        },
        {
          label: 'Generate database and files backup (Drush 8 only) [drush archive-dump]',
          value: 'DrushArchiveDump',
        },
        {
          label: 'Generate login link [drush uli]',
          value: 'DrushUserLogin',
        },
      ],
    },
  ];

  // filter default tasks
  // @ts-ignore
  options = options.filter(option => !blocklist.includes(option.options.value));

  if (advancedTasks && advancedTasks.length) {
    const filteredAdvancedTasks = advancedTasks.filter(task => !blocklist.includes(task.value));

    filteredAdvancedTasks.forEach((advancedTask, idx) => {
      baseAdvancedTaskOptions.push({
        ...advancedTask,
        value: `${advancedTask.value}-${idx}`,
        taskValue: advancedTask.value,
      });
    });

    filteredAdvancedTasks.length && options.push({ label: 'Run an advanced task', options: baseAdvancedTaskOptions });
  }

  return options;
};
