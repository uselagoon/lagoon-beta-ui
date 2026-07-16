'use client';

import { useEffect, useState } from 'react';
import ChangeFeed from './ChangeFeed';
import { ChangeFeedItemProps } from './ChangeFeedItem';
import { ChangeFeedDataSchema } from '@ui-lib/schemas/changeFeed';

export type ChangeFeedContainerProps = {
    sourceData?: string;
    refetchInterval?: number;
    fallbackData?: ChangeFeedItemProps[];
    onError?: (error: Error) => void;
    showLoading?: boolean;
};

export default function ChangeFeedContainer({
    sourceData = 'https://raw.githubusercontent.com/amazeeio/lagoon-changefeed-data/refs/heads/main/changefeed.json',
    refetchInterval = 600000,
    fallbackData = [],
    onError,
    showLoading = true,
}: ChangeFeedContainerProps) {
    const [data, setData] = useState<ChangeFeedItemProps[]>(fallbackData);
    const [isLoading, setIsLoading] = useState(!!sourceData);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!sourceData) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(sourceData, {
                    cache: 'no-cache',
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch change feed data: ${response.statusText}`);
                }

                const json = await response.json();

                const validated = ChangeFeedDataSchema.safeParse(json);

                if (!validated.success) {
                    console.error('Changefeed validation failed:', validated.error.format());
                    throw new Error('Invalid changefeed data format');
                }

                setData(validated.data.changes);
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Unknown error');
                setError(error);
                onError?.(error);
                setData(fallbackData);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        if (refetchInterval > 0) {
            const intervalId = setInterval(fetchData, refetchInterval);
            return () => clearInterval(intervalId);
        }
    }, [sourceData, refetchInterval]);

    if (isLoading && showLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-gray-500">Loading changefeed...</div>
            </div>
        );
    }

    if (error && data.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-red-500">
                    Failed to load changefeed. {error.message}
                </div>
            </div>
        );
    }

    return <ChangeFeed changeFeedItems={data} />;
}
