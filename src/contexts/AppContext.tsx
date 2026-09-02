'use client';

import React, { ReactNode, useMemo } from 'react';

import { useSession } from 'next-auth/react';
import { useEnvContext } from '@/contexts/EnvContext';
import { useParams, usePathname } from 'next/navigation';

import { useSidenavItems } from '@/components/dynamicNavigation/useSidenavItems';
import { RootLayout, ThemeSwitch, Toaster, SidebarItem, SidebarSection } from '@/ui-library';
import manualSignOut from 'utils/manualSignOut';
import { useOverrides } from "@/contexts/OverrideContext";
import MaintenanceBanner from '@/components/maintenanceBanner/MaintenanceBanner';


const AppProvider = ({ children, kcUrl, logo }: { children: ReactNode; kcUrl: string; logo?: ReactNode }) => {
  const { status, data } = useSession();

  const { projectSlug, environmentSlug, organizationSlug } = useParams();

  const userData = status === 'authenticated' ? data.user : { name: '', email: '', image: '' };

  const { LAGOON_UI_ICON, LAGOON_VERSION } = useEnvContext();

  const pathname = usePathname();

  // notion style dynamic sidenav items
  const [sidenavItems, footerItems] = useSidenavItems(kcUrl, projectSlug, environmentSlug, organizationSlug);
  const overrides = useOverrides();

  const memoizedLogo = useMemo(() => {
    const getLogo = () => {
      // either uses a logo from a prop, runtime env var; if undefined - ui library will default to LagoonLogo;
      if (logo) return logo;

      if (LAGOON_UI_ICON) {
        // if (theme === 'dark') {
        //   return <img alt="Home" className="icon logo" src={`data:image/svg+xml;utf8,${LAGOON_UI_ICON}`} />;
        // }

        // light mode - get the direct `path` children of the <svg> with applied clip-path and #fff fill, replace with #000;

        const decodedSvg = decodeURIComponent(LAGOON_UI_ICON);
        const modifiedSvg = decodedSvg.replace(
          /(<path[^>]+clip-path=['"][^'"]+['"][^>]*?)fill:\s*#fff;/g,
          '$1fill:#000;'
        );
        const reEncodedSvg = encodeURIComponent(modifiedSvg);

        return <img alt="Home" className="icon logo" src={`data:image/svg+xml;utf8,${reEncodedSvg}`} />;
      }
      return undefined;
    };

    return getLogo();
  }, [LAGOON_UI_ICON]);

  return (
    <>
      <RootLayout
        appInfo={{
          kcUrl: kcUrl,
          name: 'Lagoon',
          version: String(LAGOON_VERSION),
        }}
        userInfo={userData as any}
        signOutFn={manualSignOut}
        currentPath={pathname}
        sidenavItems={sidenavItems}
        cardProps={overrides?.components?.announcementCard}
        documentationUrl={overrides?.global?.documentationUrl}
        footerItems={footerItems}
        disableChangeFeedLink={overrides?.components?.sidenavFooterMenu?.disableChangeFeedLink}
      >
        <div className="absolute top-2 right-10">
          <MaintenanceBanner />
        </div>
        <div className="absolute top-2 right-4">
          <ThemeSwitch />
        </div>
        <section className="my-10">
          {children}
          <Toaster />
        </section>
      </RootLayout>
    </>
  );
};
export default AppProvider;
