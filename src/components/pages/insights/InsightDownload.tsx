import { Insight } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/insights/page';
import { gql, useLazyQuery } from '@apollo/client';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@uselagoon/ui-library';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { isValidUrl } from 'utils/isValidUrl';

const getDownloadURL = gql`
  query getEnvironment($environmentID: Int!) {
    environment: environmentById(id: $environmentID) {
      id
      insights {
        id
        downloadUrl
      }
    }
  }
`;

export const InsightDownload = ({ insight, environmentId }: { insight: Insight; environmentId: number }) => {
  const [getInsightsDownload, { loading }] = useLazyQuery(getDownloadURL, {
    variables: {
      environmentID: environmentId,
    },
    fetchPolicy: 'network-only',
    onCompleted: data => {
      const allInsights = data.environment?.insights;
      const targetInsight = allInsights?.find((envInsight: Insight) => envInsight.id === insight.id);

      if (targetInsight?.downloadUrl && isValidUrl(targetInsight.downloadUrl)) {
        const { downloadUrl } = targetInsight;

        window.open(downloadUrl, '_blank', 'noopener,noreferrer');
      } else {
        console.error(`Error fetching insights download: ${targetInsight.id}`);
        toast.error('Error fetching insights', {
          id: 'restore_err',
          description: 'Invalid Url',
        });
      }
    },
    onError: error => {
      console.error('Error fetching insights:', error);
      toast.error('Error fetching insights', {
        id: 'restore_err',
        description: error.message,
      });
    },
  });

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button onClick={() => getInsightsDownload()}>
          <Download />
        </Button>
      </TooltipTrigger>

      <TooltipContent>Download {loading && <Loader2 className="animate-spin" />}</TooltipContent>
    </Tooltip>
  );
};
