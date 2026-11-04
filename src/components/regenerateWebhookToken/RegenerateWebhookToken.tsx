import React, { FC, ReactNode } from 'react';

import { Button, Notification, Tooltip, TooltipContent, TooltipTrigger } from '@/ui-library';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export const generateWebhookToken = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, '0')).join('');

const runGenerateWebhookToken = async (onGenerate: (webhookToken: string) => Promise<unknown>) => {
  try {
    await onGenerate(generateWebhookToken());
  } catch (err) {
    console.error(err);
    toast.error('Error', {
      id: 'webhook_token_error',
      description: err instanceof Error ? err.message : String(err),
    });
  }
};

export const RegenerateWebhookToken = ({hasToken, message, loading, onGenerate}: {hasToken: boolean; message: ReactNode; loading: boolean; onGenerate: (webhookToken: string) => Promise<unknown>; }) => {

  if (!hasToken) {
    return (
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">No webhook token set</p>
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => runGenerateWebhookToken(onGenerate)}
        >
          {loading && <Loader2 className="animate-spin" />}
          Generate token
        </Button>
      </div>
    );
  }

  return (
    <Notification
      title="Confirm regeneration"
      message={message}
      cancelText="Cancel"
      confirmText="Regenerate"
      onConfirm={() => runGenerateWebhookToken(onGenerate)}
    >
      <div className="flex items-center self-center cursor-pointer" aria-label="regenerate token">
        <Tooltip>
          <TooltipTrigger asChild>
            <RefreshCw
              className={`w-4 h-4 shrink-0 text-muted-foreground hover:text-black dark:hover:text-gray-100 transition-colors ${loading ? 'animate-spin' : ''}`}
            />
          </TooltipTrigger>
          <TooltipContent>Regenerate token</TooltipContent>
        </Tooltip>
      </div>
    </Notification>
  );
};

export default RegenerateWebhookToken;