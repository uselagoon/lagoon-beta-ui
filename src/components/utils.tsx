import { Problem } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/problems/page';
import { cn } from '@uselagoon/ui-library';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

import { Task } from './types';

dayjs.extend(duration);
dayjs.extend(utc);

export const getHighestSeverityProblem = (problems: Problem[]) => {
  if (problems.some(p => p.severity === 'CRITICAL')) {
    return 'critical';
  }
  if (problems.some(p => p.severity === 'HIGH')) {
    return 'high';
  }
  if (problems.some(p => p.severity === 'MEDIUM')) {
    return 'medium';
  }
  if (problems.some(p => p.severity === 'LOW')) {
    return 'low';
  }
  return 'low';
};

export const makeSafe = (string: string) => string.toLocaleLowerCase().replace(/[^0-9a-z-]/g, '-');

export const debounce = (fn: (params: any) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;

  return function (val: any) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.call(null, val);
    }, delay);
  };
};

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const getTaskDuration = (task: Task) => {
  const taskStart = task.started || task.created;
  const durationStart = taskStart ? dayjs.utc(taskStart) : dayjs.utc();
  const durationEnd = task.completed ? dayjs.utc(task.completed) : dayjs.utc();
  const duration = dayjs.duration(durationEnd.diff(durationStart));

  const hours = String(Math.floor(duration.asHours())).padStart(2, '0');
  const minutes = String(duration.minutes()).padStart(2, '0');
  const seconds = String(duration.seconds()).padStart(2, '0');

  let result = `${hours}:${minutes}:${seconds}`;
  return result;
};

type SortDirection = 'asc' | 'desc' | false;

type DataTableColumn = {
  toggleSorting: (desc: boolean) => void;
  clearSorting: () => void;
};

export const handleSort = (sortDirection: SortDirection, column: DataTableColumn) => {
  if (sortDirection === false) {
    column.toggleSorting(false);
  } else if (sortDirection === 'asc') {
    column.toggleSorting(true);
  } else {
    column.clearSorting();
  }
};

export const renderSortIcons = (sortDirection: SortDirection) => {
  return !sortDirection ? (
    <ArrowUpDown />
  ) : (
    <>
      <ChevronUp
        className={cn('h-1 w-1 transition-colors', sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400')}
      />
      <ChevronDown
        className={cn('h-1 w-1 transition-colors', sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400')}
      />
    </>
  );
};

export function humanFileSize(size: number) {
  if (!size) {
    return [false, null];
  }
  const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  //@ts-ignore
  const formatted = (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];

  return [formatted.length > 5, formatted];
}

export function humanFileSizeNoOverflow(size: number): string {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  const formatted = (size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];

  return formatted;
}

// https://github.com/kubernetes/apimachinery/blob/v0.34.1/pkg/util/validation/validation.go#L219
// javascript implementation of the function used by kubernetes to verify ingress
const dns1123LabelFmt: string = "[a-z0-9]([-a-z0-9]*[a-z0-9])?";
const dns1123SubdomainFmt: string = `${dns1123LabelFmt}(\\.${dns1123LabelFmt})*`;
const dns1123SubdomainMaxLength: number = 253;
export function isDNS1123Subdomain(value: string): boolean {
  if (value.length > dns1123SubdomainMaxLength) {
      return false;
  }
  const dns1123SubdomainRegexp = new RegExp(dns1123SubdomainFmt);
  if (!dns1123SubdomainRegexp.test(value)) {
      return false;
  }
	return true;
}

// https://github.com/kubernetes/apimachinery/blob/v0.34.1/pkg/util/validation/validation.go#L41
// javascript implementation of the function used by kubernetes to verify annotation/label keys
const labelKeyCharFmt = "[A-Za-z0-9]";
const labelKeyExtCharFmt = "[-A-Za-z0-9_.]";
const labelKeyFmt = `(${labelKeyCharFmt}${labelKeyExtCharFmt}*)?${labelKeyCharFmt}`;
const labelKeyErrMsg = "must consist of alphanumeric characters, '-', '_' or '.', and must start and end with an alphanumeric character";
const labelKeyMaxLength = 63;
const labelKeyRegexp = new RegExp(`^${labelKeyFmt}$`);
export function isLabelKey(value: string) {
  const errs: any[] = [];
  const parts = value.split("/");
  let name;
  switch (parts.length) {
    case 1:
      name = parts[0];
      break;
    case 2:
      const prefix = parts[0];
      name = parts[1];
      if (prefix.length === 0) {
        errs.push("prefix part cannot be empty");
      } else if (!isDNS1123Subdomain(prefix)) {
        errs.push(`prefix part ${prefix} must be a valid DNS subdomain`);
      }
      break;
    default:
      return errs.concat(`a valid label key ${labelKeyErrMsg} with an optional DNS subdomain prefix and '/' (e.g. 'example.com/MyName')`);
  }
  if (name.length === 0) {
    errs.push("name part cannot be empty");
  } else if (name.length > labelKeyMaxLength) {
    errs.push(`name part exceeds maximum length of ${labelKeyMaxLength}`);
  }
  if (!labelKeyRegexp.test(name)) {
    errs.push(`name part ${labelKeyErrMsg}`);
  }
  return errs;
}