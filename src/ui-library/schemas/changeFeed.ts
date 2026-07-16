import { z } from 'zod';

export const ChangeFeedItemSchema = z.object({
    id: z.string().min(1, 'ID is required'),
    date: z.string().regex(/^[A-Z]+ \d+( \d{4})?$/, 'Date must be in format "MONTH DAY YEAR"'),
    title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title must be less than 200 characters'),
    description: z.string().max(2000, 'Description must be less than 2000 characters'),
    tags: z.array(z.string()).min(1, 'At least one tag is required').max(5, 'Maximum of 5 tags').optional(),
});

export const ChangeFeedContainerSchema = z.object({
    sourceData: z.url(),
    refetchInterval: z.number().optional(),
    fallbackData: z.array(ChangeFeedItemSchema).optional(),
    onError: z.function().optional(),
    showLoading: z.boolean().optional(),
});

export const ChangeFeedDataSchema = z.object({
    changes: z.array(ChangeFeedItemSchema),
});

export type ChangeFeedItemType = z.infer<typeof ChangeFeedItemSchema>;
export type ChangeFeedDataType = z.infer<typeof ChangeFeedDataSchema>;
