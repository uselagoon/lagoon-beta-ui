'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge, Button, Popover, PopoverContent, PopoverTrigger } from '@/ui-library';
import { Check, ExternalLink } from 'lucide-react';
import NotificationRow from './_components/NotificationRow';
import NotificationSheet from './_components/NotificationSheet';
import { formatUpdated, getWorstSeverity } from './_components/format';

export type Maintenance = {
  id: string;
  name: string;
  impact: string;
  shortlink: string;
  status: string;
  scheduled_for: string;
  scheduled_until: string;
  startsIn?: number;
  type: 'Maintenance';
};

export type Incident = {
  id: string;
  name: string;
  impact: string;
  shortlink: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  type: 'Incident';
};

export type BannerItem = Maintenance | Incident;

// maps the resp from a status endpoint into the banner items
export type StatusMapper = (data: unknown) => BannerItem[];

const DEFAULT_ENDPOINT = 'https://status.amazee.io/api/v2/summary.json';
const DEFAULT_POLL_INTERVAL = 180000;

function getURl(url: string) {
  try {
    return new URL(url).origin;
  } catch {
    return undefined;
  }
}

type StatuspagePayload = {
  incidents?: Array<{
    id: string;
    name: string;
    impact: string;
    shortlink: string;
    status: string;
    created_at?: string;
    updated_at?: string;
  }>;
  scheduled_maintenances?: Array<{
    id: string;
    name: string;
    impact: string;
    shortlink: string;
    status: string;
    scheduled_for: string;
    scheduled_until: string;
  }>;
};

// default mapper tailored for amazee.io
// a custom `mapper` can be added to support other status endpoints
export const statuspageMapper: StatusMapper = data => {
  const { incidents = [], scheduled_maintenances = [] } = (data ?? {}) as StatuspagePayload;
  const now = Date.now();
  const items: BannerItem[] = incidents.map(incident => ({ ...incident, type: 'Incident' }));

  const sortedMaintenances = [...scheduled_maintenances].sort(
    (a, b) => new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime()
  );

  for (const maint of sortedMaintenances) {
    const minutesUntil = Math.floor((new Date(maint.scheduled_for).getTime() - now) / 60000);
    if (maint.status !== 'scheduled' || minutesUntil < 60) {
      items.push({ ...maint, startsIn: minutesUntil > 0 ? minutesUntil : undefined, type: 'Maintenance' });
    }
  }

  return items;
};

export type MaintenanceBannerProps = {
  endpoint?: string;
  pollInterval?: number;
  mapper?: StatusMapper;
  title?: string;
  statusPageUrl?: string;
  onError?: (error: unknown) => void;
};

export default function MaintenanceBanner({
  endpoint = DEFAULT_ENDPOINT,
  pollInterval = DEFAULT_POLL_INTERVAL,
  mapper = statuspageMapper as StatusMapper,
  title = 'Notifications',
  statusPageUrl = getURl(endpoint),
  onError,
}: MaintenanceBannerProps) {
  const [items, setItems] = useState<BannerItem[]>([]);
  // TODO: state managment
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const [selected, setSelected] = useState<BannerItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const selectedRowRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function poll() {
      try {
        const response = await fetch(endpoint, { signal: controller.signal });
        const data = await response.json();
        if (!cancelled) {
          setItems(mapper(data));
          setUpdatedAt(Date.now());
        }
      } catch (error) {
        if (!cancelled) onError?.(error);
      }
    }

    poll();
    const intervalId = setInterval(poll, pollInterval);

    return () => {
      cancelled = true;
      controller.abort();
      clearInterval(intervalId);
    };
  }, [endpoint, pollInterval, mapper, onError]);

  const openSheet = (item: BannerItem, row: HTMLButtonElement) => {
    selectedRowRef.current = row;
    setSelected(item);
    setSheetOpen(true);
  };

  const restoreRowFocus = (event: Event) => {
    event.preventDefault();
    selectedRowRef.current?.focus();
  };

  const groups = [
    { label: 'Incidents', items: items.filter(item => item.type === 'Incident') },
    { label: 'Maintenance', items: items.filter(item => item.type === 'Maintenance') },
  ].filter(group => group.items.length > 0);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            {title}
            {items.length > 0 && (
              <Badge variant={getWorstSeverity(items)} className="min-w-5 rounded-full px-1.5 tabular-nums">
                {items.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-[360px] max-w-[calc(100vw-3rem)] bg-[var(--card)] p-0"
          onInteractOutside={event => sheetOpen && event.preventDefault()}
        >
          <div className="flex items-baseline justify-between px-3.5 pt-3 pb-2">
            <h2 className="text-sm font-semibold">{title}</h2>
            <span className="text-xs text-[var(--muted-foreground)]">{items.length} active</span>
          </div>
          {groups.length === 0 ? (
            <div className="flex items-center gap-2.5 p-3.5">
              <div className="grid size-7 place-items-center rounded-full bg-[var(--badge-success-bg)]/20">
                <Check className="size-4 text-[var(--badge-success-bg)]" strokeWidth={2.5} aria-hidden="true" />
              </div>
              <p className="text-sm">
                All systems operational
                <span className="block text-xs text-[var(--muted-foreground)]">No incidents or maintenance right now</span>
              </p>
            </div>
          ) : (
            groups.map(group => (
              <div key={group.label}>
                <h3 className="px-3.5 pt-2 pb-0.5 text-[11px] font-medium tracking-wide text-[var(--muted-foreground)] uppercase">
                  {group.label}
                </h3>
                {group.items.map(item => (
                  <NotificationRow key={item.id} item={item} onSelect={openSheet} />
                ))}
              </div>
            ))
          )}
          <div className="mt-1.5 flex items-center justify-between border-t px-3.5 py-2.5 text-xs text-[var(--muted-foreground)]">
            <span>{formatUpdated(updatedAt)}</span>
            {statusPageUrl && (
              <a
                href={statusPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[var(--badge-lagoon-bg)] hover:text-[var(--badge-lagoon-hover)]"
              >
                {statusPageUrl.replace(/^https?:\/\//, '')}
                <ExternalLink className="size-3" aria-hidden="true" />
              </a>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <NotificationSheet item={selected} open={sheetOpen} onOpenChange={setSheetOpen} onCloseAutoFocus={restoreRowFocus} />
    </>
  );
}
