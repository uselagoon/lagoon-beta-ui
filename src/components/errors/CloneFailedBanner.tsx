'use client';

import { usePathname } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

interface CloneFailedBannerProps {
  status: 'FAILED' | 'CANCELLED';
  projectPath?: boolean;
}

const CloneFailedBanner = ({ status, projectPath = false }: CloneFailedBannerProps) => {
  const pathname = usePathname();

  if (projectPath) {
    const PROJECT_PAGES = new Set(['deploy-targets', 'project-details', 'project-variables', 'routes']);
    const paths = pathname.split('/').filter(Boolean);
    const isProjectPage = paths.length === 2 || (paths.length === 3 && PROJECT_PAGES.has(paths[2]));
    if (!isProjectPage) {
      return null;
    }
  }

  const statusText = status === 'FAILED' ? 'failed' : 'was cancelled';

  const banner = (
    <div className="flex items-center gap-2 rounded-md border border-destructive/50 px-4 py-2 text-sm text-destructive dark:border-destructive dark:text-red-400">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>
        <strong>Project cloning {statusText} |</strong>: functionality may be limited
      </span>
    </div>
  );

  if (projectPath) {
    return <div className="px-[18px] pt-[16px]">{banner}</div>;
  }

  return banner;
};

export default CloneFailedBanner;
