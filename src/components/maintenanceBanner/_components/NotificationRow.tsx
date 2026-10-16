import { MouseEvent } from 'react';
import { ChevronRight } from 'lucide-react';
import { BannerItem } from '../MaintenanceBanner';
import { dotClass, getMeta, getSeverity } from './format';

type NotificationRowProps = {
  item: BannerItem;
  onSelect: (item: BannerItem, row: HTMLButtonElement) => void;
};

// a single flat row in the notifications popover, opens the detail sheet on click
export default function NotificationRow({ item, onSelect }: NotificationRowProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => onSelect(item, event.currentTarget);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="grid w-full grid-cols-[8px_1fr_16px] items-center gap-x-2.5 px-3.5 py-2 text-left hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
    >
      <span className={`row-span-2 size-2 rounded-full ${dotClass[getSeverity(item)]}`} aria-hidden="true" />
      <span className="truncate text-sm font-medium">{item.name}</span>
      <ChevronRight className="col-start-3 row-span-2 row-start-1 size-4 text-[var(--muted-foreground)]" aria-hidden="true" />
      <span className="col-start-2 truncate text-xs text-[var(--muted-foreground)]">{getMeta(item)}</span>
    </button>
  );
}
