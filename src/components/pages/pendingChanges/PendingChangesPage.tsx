'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import EnvironmentNotFound from '@/components/errors/EnvironmentNotFound';
import { QueryRef, useReadQuery } from '@apollo/client';
import { Button, DataTable, DateRangePicker, SelectWithOptions } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

import { PendingChangesTableColumns } from './DataTableColumns';
import { PendingChangesData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/pending-changes/page';

import { useRouter } from 'next/navigation';

export default function PendingChangesPage({
    queryRef,
    environmentSlug,
}: {
    queryRef: QueryRef<PendingChangesData>;
    environmentSlug: string;
}) {
    const {
            data: { environment },
    } = useReadQuery(queryRef);

    const router = useRouter();

    const [{ pendingchanges_query, pendingchanges_results }, setQuery] = useQueryStates({
            pendingchanges_results: {
                defaultValue: 10,
                parse: (value: string | undefined) => (value !== undefined ? Number(value) : 10),
            },
            pendingchanges_query: {
                defaultValue: '',
                parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
            },
    });

    if (!environment) {
        return <EnvironmentNotFound openshiftProjectName={environmentSlug} />;
    }

    const setPendingChangesResults = (val: string) => {
        setQuery({ pendingchanges_results: Number(val) });
    };

    const { pendingChanges } = environment;
    
    const defaultDeploymentUrl = `/projects/${environment.project?.name}/${environmentSlug}/deployments`;

    return (
        <SectionWrapper>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight my-4">Pending Changes</h3>
        <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
            View all pending changes on this environment
        </span>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-sm">
            <p className="text-blue-800">
                <strong>Note:</strong> A deployment is required for these changes to take effect
            </p>
        </div>
        <div className="p-2">
            <Button variant="default"
                onClick={() => {
                    router.push(defaultDeploymentUrl);
                }}
            >
            Deploy now
            </Button>
        </div>
        <DataTable
            columns={PendingChangesTableColumns}
            data={pendingChanges}
            initialSearch={pendingchanges_query}
            initialPageSize={pendingchanges_results}
            renderFilters={table => (
            <div className="flex gap-2 items-baseline">
                <SelectWithOptions
                options={[
                    {
                    label: '10 results per page',
                    value: 10,
                    },
                    {
                    label: '20 results per page',
                    value: 20,
                    },
                    {
                    label: '50 results per page',
                    value: 50,
                    },
                ]}
                width={100}
                value={String(pendingchanges_results)}
                placeholder="Results per page"
                onValueChange={newVal => {
                    table.setPageSize(Number(newVal));
                    setPendingChangesResults(newVal);
                }}
                />
            </div>
            )}
        />
        </SectionWrapper>
    );
}
