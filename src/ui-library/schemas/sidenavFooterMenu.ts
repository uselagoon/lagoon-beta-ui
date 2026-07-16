import { z } from 'zod';

export const SidenavFooterMenuSchema = z.object({
    email: z.email().optional(),
    documentationUrl: z.url().optional(),
    disableAccountLink: z.boolean().optional(),
    disableChangeFeedLink: z.boolean().optional(),
}).strict();

export type SidenavFooterMenu = z.infer<typeof SidenavFooterMenuSchema>;