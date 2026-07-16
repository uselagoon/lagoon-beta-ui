import { z } from 'zod';

export const AnnouncementCardPropsSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ctaText: z.string().optional(),
    ctaUrl: z.string().optional(),
    openInNewTab: z.boolean().optional(),
    className: z.string().optional(),
    defaultLogo: z.boolean().optional(),
    disabled: z.boolean().optional(),
}).strict();