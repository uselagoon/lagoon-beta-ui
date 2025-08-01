'use client';

import React from 'react';
import { TabNavigation} from "@uselagoon/ui-library";
import SectionWrapper from "@/components/SectionWrapper/SectionWrapper";
import {organizationNavItems} from "@/components/shared/organizationNavItems";
import { OrgBreadcrumbs } from '@/components/breadcrumbs/OrgBreadcrumbs';
import { DataTable } from '@uselagoon/ui-library';

export default function Loading() {

  const navItems = organizationNavItems("loading");

  return (
    <>
      <OrgBreadcrumbs />  
      <TabNavigation items={navItems} pathname={""}></TabNavigation>
      <SectionWrapper>
        <header>Groups</header>
        <DataTable
          columns={[]}
          data={[]}
        />
      </SectionWrapper>
    </>
  );
}
