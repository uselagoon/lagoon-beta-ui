'use client';

import React, { SetStateAction } from 'react';

import { groupFilterValues } from '@/components/pages/organizations/groups/_components/groupFilterValues';
import { CheckboxContainer } from '@/components/pages/organizations/groups/_components/styles';
// import { Checkbox, LagoonFilter, Table } from '@uselagoon/ui-library';
import { Tooltip } from 'antd';
import {Breadcrumb, TabNavigation} from "@uselagoon/ui-library";
import Link from "next/link";
import TableWrapper from "@/components/tableWrapper/TableWrapper";
import {organizationNavItems} from "@/components/shared/organizationNavItems";

// const { OrgGroupsTable } = Table;

export default function Loading() {

  const navItems = organizationNavItems("loading");

  return (
    <>
      <Breadcrumb
        type="orgs"
        items={[
          {
            title: <Link href="/organizations">Organizations</Link>,
            key: "organizations"
          },
          {
            title: "Loading",
            copyText: "Loading",
            key: "org"
          },
        ]}
      />
      <TabNavigation items={navItems} pathname={""}></TabNavigation>
      <TableWrapper>
        <header>Groups</header>
      </TableWrapper>
    </>
  );
}
