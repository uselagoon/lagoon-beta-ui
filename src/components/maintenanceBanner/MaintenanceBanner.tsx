'use client';

import { useEffect, useState } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent, Button } from '@/ui-library';
import { Info, ChevronDown, X } from 'lucide-react';
import BannerCard from './_components/BannerCard';

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
  type: 'Incident';
};

export type BannerItem = Maintenance | Incident;

// maps the resp from a status endpoint into the banner items
export type StatusMapper = (data: unknown) => BannerItem[];

const DEFAULT_ENDPOINT = 'https://status.amazee.io/api/v2/summary.json';
const DEFAULT_POLL_INTERVAL = 180000;

type StatuspagePayload = {
  incidents?: Array<{ id: string; name: string; impact: string; shortlink: string; status: string }>;
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
  onError?: (error: unknown) => void;
};

export default function MaintenanceBanner({
  endpoint = DEFAULT_ENDPOINT,
  pollInterval = DEFAULT_POLL_INTERVAL,
  mapper = statuspageMapper as StatusMapper,
  title = 'Active Service Disruptions',
  onError,
}: MaintenanceBannerProps) {
  const [items, setItems] = useState<BannerItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function poll() {
      try {
        const response = await fetch(endpoint, { signal: controller.signal });
        const data = await response.json();
        if (!cancelled) setItems(mapper(data));
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

  if (items.length === 0) return null;

  return (
    <Collapsible className="w-full max-w-xl rounded-lg bg-[var(--background)]">
      <div className="pb-2 px-3">
        <div className="flex items-center justify-end">
          <div className="flex gap-2 items-center">
            <div>
              <CollapsibleTrigger className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-xl flex items-center justify-center bg-[var(--badge-warning-bg)]/25">
                  <Info className="w-5 h-5 text-[var(--badge-warning-bg)]" />
                </div>
                <p className="text-sm text-[var(--muted-foreground)]">
                  ({items.length})
                </p>
              </CollapsibleTrigger>
            </div>
          </div>
        </div>
      </div>
      <CollapsibleContent className="relative z-[1] border-3 rounded-lg bg-background pt-3">
        {items.map(item => (
          <BannerCard key={item.id} item={item} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}