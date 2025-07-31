import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(isBetween);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);

export const dateRangeFilter = (row: any, columnId: any, filterValue: any) => {
  const rowDate: Date = row.getValue(columnId);
  const dayjsRowDate = dayjs(rowDate);

  if (!filterValue?.from && !filterValue?.to) {
    return true;
  }

  const { from, to } = filterValue;

  const dayjsFrom = from ? dayjs(from) : null;
  const dayjsTo = to ? dayjs(to) : null;

  let matchesFrom = true;
  if (dayjsFrom) {
    matchesFrom = dayjsRowDate.isSame(dayjsFrom, 'day') || dayjsRowDate.isAfter(dayjsFrom, 'day');
  }

  let matchesTo = true;
  if (dayjsTo) {
    matchesTo = dayjsRowDate.isSame(dayjsTo, 'day') || dayjsRowDate.isBefore(dayjsTo, 'day');
  }

  return matchesFrom && matchesTo;
};
