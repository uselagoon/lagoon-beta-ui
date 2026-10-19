import { Badge, Button, ShadSheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/ui-library';
import { BannerItem } from '../MaintenanceBanner';
import { formatDateTime, humanise } from './format';

type NotificationSheetProps = {
  item: BannerItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseAutoFocus: (event: Event) => void;
};

function getFields(item: BannerItem): [string, string][] {
  const fields: [string, string][] = [
    ['Status', humanise(item.status)],
    ['Impact', humanise(item.impact)],
  ];

  if (item.type === 'Incident') {
    if (item.created_at) fields.push(['Started', formatDateTime(item.created_at)]);
    if (item.updated_at) fields.push(['Last update', formatDateTime(item.updated_at)]);
  } else {
    fields.push(['Window', `${formatDateTime(item.scheduled_for)} to ${formatDateTime(item.scheduled_until)}`]);
    if (item.startsIn != null) fields.push(['Starts in', `${item.startsIn} minutes`]);
  }

  return fields;
}

export default function NotificationSheet({ item, open, onOpenChange, onCloseAutoFocus }: NotificationSheetProps) {
  return (
    <ShadSheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="gap-0 bg-[var(--card)] sm:max-w-[440px]" onCloseAutoFocus={onCloseAutoFocus}>
        {item && (
          <>
            <SheetHeader className="gap-2 px-5 pt-5 pb-3">
              <Badge variant={item.type === 'Incident' ? 'danger' : 'lagoon'}>{item.type}</Badge>
              <SheetTitle className="pr-7 text-lg text-balance">{item.name}</SheetTitle>
              <SheetDescription>
                {humanise(item.impact)} impact, {humanise(item.status).toLowerCase()}
              </SheetDescription>
            </SheetHeader>
            <dl className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-2.5 border-t px-5 py-3 text-sm">
              {getFields(item).map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-[var(--muted-foreground)]">{label}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            <SheetFooter className="flex-row justify-end border-t px-5 py-4">
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
              {item.shortlink && (
                <Button asChild>
                  <a href={item.shortlink} target="_blank" rel="noopener noreferrer">
                    Open on status page
                  </a>
                </Button>
              )}
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </ShadSheet>
  );
}
