'use client';

import { useEffect, useState } from 'react';
import { OrganizationProjectsData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/projects/(projects-page)/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { CreateProject } from '@/components/createProject/CreateProject';
import OrganizationNotFound from '@/components/errors/OrganizationNotFound';
import { QueryRef, useQueryRefHandlers, useReadQuery, useSubscription } from '@apollo/client';
import { DataTable, SelectWithOptions } from '@/ui-library';
import { useQueryStates } from 'nuqs';
import organizationProjectChangedSubscription from '@/lib/subscription/organizations/organizationProjectChanged';
import { STATUSES } from '@/contexts/CloneStatusContext';

import { ProjectsDataTableColumns } from './_components/ProjectsDataTableColumns';
import { RemoveProject } from './_components/RemoveProject';
import { resultsFilterValues } from './_components/filterOptions';

type CloneStatusEntry = { projectId: number; status: string };

function loadCloneStatusOverrides(orgSlug: string): Map<number, string> {
  if (typeof window === 'undefined') return new Map();
  try {
    const lsData = window.localStorage.getItem(`lagoon-org-clone-status:${orgSlug}`);
    if (!lsData) return new Map();
    const entries: CloneStatusEntry[] = JSON.parse(lsData);
    return new Map(
      entries.filter(e => !STATUSES.includes(e.status)).map(e => [e.projectId, e.status])
    );
  } catch {
    return new Map();
  }
}

function saveCloneStatusOverrides(orgSlug: string, overrides: Map<number, string>) {
  if (typeof window === 'undefined') return;
  const entries: CloneStatusEntry[] = Array.from(overrides.entries()).map(([projectId, status]) => ({
    projectId,
    status,
  }));
  window.localStorage.setItem(`lagoon-org-clone-status:${orgSlug}`, JSON.stringify(entries));
}

export default function OrgProjectsPage({
  queryRef,
  organizationSlug,
}: {
  queryRef: QueryRef<OrganizationProjectsData>;
  organizationSlug: string;
}) {
  const [{ results, project_query }, setQuery] = useQueryStates({
    results: {
      defaultValue: undefined,
      parse: (value: string | undefined) => {
        if (value == undefined || Number.isNaN(Number(value))) {
          return undefined;
        }

        const num = Number(value);

        if (num > 100) {
          return 100;
        }
        return num;
      },
    },
    project_query: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },
  });

  const setResults = (val: string) => {
    setQuery({ results: Number(val) });
  };

  const setProjectQuery = (str: string) => {
    setQuery({ project_query: str });
  };

  const { refetch } = useQueryRefHandlers(queryRef);

  const {
    data: { organization },
  } = useReadQuery(queryRef);

  const refetchData = async () => {
    await Promise.all([refetch()]);
  };

  let projectCloneEnabled = organization?.featureProjectClone ?? false;

  const [cloneStatusOverrides, setCloneStatusOverrides] = useState<Map<number, string>>(
    () => loadCloneStatusOverrides(organizationSlug)
  );

  useEffect(() => {
    if (cloneStatusOverrides.size === 0) return;

    setCloneStatusOverrides(prev => {
      const next = new Map(prev);
      let changed = false;

      for (const project of organization?.projects ?? []) {
        if (!next.has(project.id)) continue;
        const serverStatus = project.clone?.status;
        if (!serverStatus || STATUSES.includes(serverStatus)) {
          next.delete(project.id);
          changed = true;
        }
      }

      if (changed) {
        saveCloneStatusOverrides(organizationSlug, next);
      }
      return changed ? next : prev;
    });
  }, []);

  useSubscription(organizationProjectChangedSubscription, {
    variables: { organization: organizationSlug },
    onData: ({ data }) => {
      const project = data.data?.organizationProjectChanged;
      if (!project?.clone) return;

      setCloneStatusOverrides(prev => {
        const next = new Map(prev);
        next.set(project.id, project.clone.status);
        const storage = new Map(next);
        if (STATUSES.includes(project.clone.status)) {
          storage.delete(project.id);
        }
        saveCloneStatusOverrides(organizationSlug, storage);
        return next;
      });
    },
  });

  if (!organization) {
    return <OrganizationNotFound orgName={organizationSlug} />;
  }

  const deployTargetOptions = organization.deployTargets.map(deploytarget => {
    return { label: deploytarget.name, value: deploytarget.id };
  });

  const projectsWithOverrides = [...organization.projects].map(project => {
    const overrideStatus = cloneStatusOverrides.get(project.id);
    if (!overrideStatus) return project;
    return { ...project, clone: { ...(project.clone ?? {}), status: overrideStatus } };
  });

  return (
    <>
      <SectionWrapper>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Projects</h3>
        <div className="gap-4 my-4">
          <CreateProject organizationId={organization.id} options={deployTargetOptions} />
        </div>
        <DataTable
          columns={ProjectsDataTableColumns(
            project => (
              <RemoveProject project={project} refetch={refetchData} />
            ),
            organization.name,
            projectCloneEnabled,
            refetchData
          )}
          data={projectsWithOverrides.sort((a, b) => {
            const cloningA = a.clone?.status && !STATUSES.includes(a.clone.status) ? 1 : 0;
            const cloningB = b.clone?.status && !STATUSES.includes(b.clone.status) ? 1 : 0;
            return cloningB - cloningA;
          })}
          searchableColumns={['name']}
          onSearch={searchStr => setProjectQuery(searchStr)}
          initialSearch={project_query}
          initialPageSize={results || 10}
          renderFilters={table => (
            <div className="flex items-center justify-between">
              <SelectWithOptions
                options={resultsFilterValues.map(o => ({ label: o.label, value: o.value }))}
                width={100}
                value={String(results || 10)}
                placeholder="Results per page"
                onValueChange={newVal => {
                  table.setPageSize(Number(newVal));
                  setResults(newVal);
                }}
              />
            </div>
          )}
        />
      </SectionWrapper>
    </>
  );
}
