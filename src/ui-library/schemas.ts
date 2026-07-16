import { z } from 'zod';
import { AnnouncementCardPropsSchema } from './schemas/announcementCard';
import { SidenavFooterMenuSchema } from './schemas/sidenavFooterMenu';
import { ChangeFeedContainerSchema } from './schemas/changeFeed';

const DocumentationURLSchema = z.url().optional();

const globalSchema = {
	documentationUrl: DocumentationURLSchema
};

const componentSchemas = {
	announcementCard: AnnouncementCardPropsSchema,
	sidenavFooterMenu: SidenavFooterMenuSchema,
	changeFeed: ChangeFeedContainerSchema,
};


export const OverridesSchema = z.object({
	global: z.object({
		documentationUrl: DocumentationURLSchema.optional(),
	}).strict().optional(),
	components: z.object({
		announcementCard: AnnouncementCardPropsSchema.optional(),
		sidenavFooterMenu: SidenavFooterMenuSchema.optional(),
		changeFeed: ChangeFeedContainerSchema.optional(),
	}).strict().optional(),
}).strict();

export type Overrides = z.infer<typeof OverridesSchema>;

export function validateOverrides(data: unknown): {
	valid: Overrides;
	errors: Array<{ key: string; message: string }>;
} {
	const result: Overrides = { global: {}, components: {} };
	const errors: Array<{ key: string; message: string }> = [];

	if (typeof data !== 'object' || data === null) {
		errors.push({ key: 'Override', message: 'Data must be an object' });
		return { valid: result, errors };
	}

	const rawData = data as Record<string, unknown>;

	if (rawData.global !== undefined && rawData.global !== null && typeof rawData.global === 'object') {
		for (const [name, data] of Object.entries(rawData.global)) {
			const schema = globalSchema[name as keyof typeof globalSchema];
			if (!schema) {
				errors.push({ key: `Global.${name}`, message: 'Unknown global key not compatible with overrides' });
				continue;
			}

			try {
				(result.global as Record<string, unknown>)[name] = schema.parse(data);
			} catch (error) {
				if (error instanceof z.ZodError) {
					error.issues.forEach(err => {
						errors.push({ key: `Global.${name}`, message: err.message });
					});
				}
			}
		}
	}

	if (rawData.components !== undefined && rawData.components !== null && typeof rawData.components === 'object') {
		result.components = {};

		for (const [name, data] of Object.entries(rawData.components)) {
			const schema = componentSchemas[name as keyof typeof componentSchemas];
			if (!schema) {
				errors.push({ key: `Components.${name}`, message: 'Unknown component not compatible with overrides' });
				continue;
			}

			try {
				(result.components as Record<string, unknown>)[name] = schema.parse(data);
			} catch (error) {
				if (error instanceof z.ZodError) {
					error.issues.forEach(issue => {
						errors.push({ key: `Components.${name}`, message: issue.message });
					});
				}
			}
		}
	}

	return { valid: result, errors };
}