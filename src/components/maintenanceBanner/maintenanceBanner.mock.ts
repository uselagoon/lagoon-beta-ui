import { BannerItem, StatusMapper, statuspageMapper } from './MaintenanceBanner';

// temp palceholder for mocking maintenance - to be removed prior to merge 
export const mockIncident = {
  created_at: '2014-05-14T14:22:39.441-06:00',
  id: 'cp306tmzcl0y',
  impact: 'critical',
  name: 'Unplanned Database Outage',
  page_id: '6r0x4q786p67',
  resolved_at: null,
  shortlink: 'http://stspg.co:5000/Q0E',
  status: 'identified',
  updated_at: '2014-05-14T14:35:21.711-06:00',
};

export const mockScheduledMaintenance = {
  created_at: '2014-05-14T14:27:17.303-06:00',
  id: 'k7mf5z1gz05c',
  impact: 'minor',
  name: 'Web Tier Recycle',
  page_id: '6r0x4q786p67',
  resolved_at: null,
  scheduled_for: '2014-05-14T14:30:00.000-06:00',
  scheduled_until: '2014-05-14T16:30:00.000-06:00',
  shortlink: 'http://stspg.co:5000/Q0G',
  status: 'in_progress',
  updated_at: '2014-05-14T14:35:12.258-06:00',
};

const now = Date.now();
export const mockUpcomingMaintenance = {
  ...mockScheduledMaintenance,
  id: 'a1b2c3d4e5f6',
  name: 'Scheduled Network Upgrade',
  impact: 'maintenance',
  status: 'scheduled',
  scheduled_for: new Date(now + 30 * 60000).toISOString(),
  scheduled_until: new Date(now + 90 * 60000).toISOString(),
};

export const mockStatuspagePayload = {
  page: {
    id: '6r0x4q786p67',
    name: 'amazee.io',
    url: 'https://status.amazee.io',
    updated_at: new Date(now).toISOString(),
  },
  incidents: [mockIncident],
  scheduled_maintenances: [mockScheduledMaintenance, mockUpcomingMaintenance],
};

export const mockEmptyStatuspagePayload = {
  page: mockStatuspagePayload.page,
  incidents: [],
  scheduled_maintenances: [],
};

export const mockBannerItems: BannerItem[] = statuspageMapper(mockStatuspagePayload);

export const mockStatusMapper: StatusMapper = () => mockBannerItems;
