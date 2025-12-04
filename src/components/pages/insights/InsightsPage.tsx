'use client';

import { InsightsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/insights/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import EnvironmentNotFound from '@/components/errors/EnvironmentNotFound';
import { usePendingChangesNotification } from '@/hooks/usePendingChangesNotification';
import { QueryRef, useReadQuery } from '@apollo/client';
import { DataTable, DateRangePicker, SelectWithOptions } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

import { FactsTableColumns, InsightsTableColumns } from './DataTableColumns';

export default function InsightsPage({
  queryRef,
  environmentSlug,
}: {
  queryRef: QueryRef<InsightsData>;
  environmentSlug: string;
}) {
  const {
    data: { environment },
  } = useReadQuery(queryRef);

  // Show notification for pending changes
  usePendingChangesNotification({
    environment,
    environmentSlug,
  });

  const [{ fact_results, fact_query, insights_query, insights_results }, setQuery] = useQueryStates({
    fact_results: {
      defaultValue: 10,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : 10),
    },
    fact_query: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },

    insights_results: {
      defaultValue: 10,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : 10),
    },
    insights_query: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },
  });

  if (!environment) {
    return <EnvironmentNotFound openshiftProjectName={environmentSlug} />;
  }

  const setFactQuery = (str: string) => {
    setQuery({ fact_query: str });
  };
  const setFactResults = (val: string) => {
    setQuery({ fact_results: Number(val) });
  };

  const setInsightsQuery = (str: string) => {
    setQuery({ insights_query: str });
  };
  const setInsightsResults = (val: string) => {
    setQuery({ insights_results: Number(val) });
  };

  const { insights, facts } = environment;

  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Facts</h3>
      <DataTable
        columns={FactsTableColumns}
        data={facts}
        onSearch={searchStr => setFactQuery(searchStr)}
        initialSearch={fact_query}
        initialPageSize={fact_results}
        renderFilters={table => (
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
            value={String(fact_results)}
            placeholder="Results per page"
            onValueChange={newVal => {
              table.setPageSize(Number(newVal));
              setFactResults(newVal);
            }}
          />
        )}
      />

      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight my-4">Insights</h3>

      <DataTable
        columns={InsightsTableColumns(environment.id)}
        data={insights}
        onSearch={searchStr => setInsightsQuery(searchStr)}
        initialSearch={insights_query}
        initialPageSize={insights_results}
        renderFilters={table => (
          <div className="flex gap-2 items-baseline">
            <DateRangePicker
              onUpdate={values => {
                const createdAtColumn = table.getColumn('created');
                if (createdAtColumn) {
                  if (values.range.from && values.range.to) {
                    createdAtColumn.setFilterValue(values.range);
                  } else {
                    createdAtColumn.setFilterValue(undefined);
                  }
                }
              }}
              showCompare={false}
              align="center"
              rangeText="Insight dates"
            />

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
              value={String(insights_results)}
              placeholder="Results per page"
              onValueChange={newVal => {
                table.setPageSize(Number(newVal));
                setInsightsResults(newVal);
              }}
            />
          </div>
        )}
      />
    </SectionWrapper>
  );
}
