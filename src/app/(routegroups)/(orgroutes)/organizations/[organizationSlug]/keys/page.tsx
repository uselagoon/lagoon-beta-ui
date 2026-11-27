import KeysPage from '@/components/pages/organizations/keys/KeysPage';
import { PreloadQuery } from '@/lib/apolloClient';
import organizationByNameKeys from '@/lib/query/organizations/organizationByName.keys';
import { QueryRef } from '@apollo/client';
import { OrgProject } from '../(organization-overview)/page';

type Props = {
  params: Promise<{ organizationSlug: string }>;
};

type Organization = {
  id: number;
  name: string;
  friendlyName?: string;
  projects: OrgProject[];
  keys: OrganizationKey[];
};

export type OrganizationKey = {
  id: number;
  name: string;
  publicKey: string;
  privateKey: string;
  projects: OrgProject[];
  comment: string;
  created: string;
}

export interface OrganizationKeysData {
  organization: Organization;
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
  return {
    title: `${params.organizationSlug} | Organization`,
  };
}

export default async function OrganizationKeys(props: { params: Promise<{ organizationSlug: string }> }) {
  const params = await props.params;

  const { organizationSlug } = params;

  return (
    <PreloadQuery
      query={organizationByNameKeys}
      variables={{
        displayName: 'Organization',
        name: organizationSlug,
        limit: null,
      }}
    >
      {queryRef => (
        <KeysPage organizationSlug={organizationSlug} queryRef={queryRef as QueryRef<OrganizationKeysData>} />
      )}
    </PreloadQuery>
  );
}
