'use client';

import { useState } from 'react';

import {
  Problem,
  ProblemsData,
} from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/problems/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import EnvironmentNotFound from '@/components/errors/EnvironmentNotFound';
import { usePendingChangesNotification } from '@/hooks/usePendingChangesNotification';
import { QueryRef, useReadQuery } from '@apollo/client';
import { DataTable, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@uselagoon/ui-library';

import ProblemsColumns from './ProblemsTableColumns';

enum ProblemSeverityRating {
  NONE,
  UNKNOWN,
  NEGLIGIBLE,
  LOW,
  MEDIUM,
  HIGH,
  CRITICAL,
}
export default function ProblemsPage({
  queryRef,
  environmentSlug,
}: {
  queryRef: QueryRef<ProblemsData>;
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

  const [selectedProblemId, setSelectedProblemId] = useState<number | null>(null);

  if (!environment) {
    return <EnvironmentNotFound openshiftProjectName={environmentSlug} />;
  }

  const { problems } = environment;

  const filterBySeverity = (problems: Problem[], severity: keyof typeof ProblemSeverityRating) =>
    problems.filter(problem => problem.severity === severity);

  const criticalProblems = filterBySeverity(problems, 'CRITICAL');
  const highProblems = filterBySeverity(problems, 'HIGH');
  const mediumProblems = filterBySeverity(problems, 'MEDIUM');
  const lowProblems = filterBySeverity(problems, 'LOW');

  // const dismissedProblems = problems.filter(problem => problem.deleted === '0000-00-00 00:00:00');
  // TODO: whenever dismissal is implemented
  const dismissedProblems = [] as Problem[];

  const allProblemsSorted = [...criticalProblems, ...highProblems, ...mediumProblems, ...lowProblems];

  const selectedProblem = allProblemsSorted.find(problem => problem.id === selectedProblemId);

  const handleSelectProblem = (id: number) => {
    id && setSelectedProblemId(id);
  };
  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Problems</h3>
      <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
        Problems are generated from SBOM data extracted for the underlying services and system
      </span>

      <DataTable data={allProblemsSorted} columns={ProblemsColumns(handleSelectProblem)} />

      <Dialog open={Boolean(selectedProblem)} onOpenChange={() => setSelectedProblemId(null)}>
        <DialogContent className="w-[80vw]">
          <DialogHeader>
            <DialogTitle>Problem overview</DialogTitle>
            <DialogDescription>Details for {selectedProblem?.identifier}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="col-span-3">{selectedProblem?.description}</div>
          </div>
        </DialogContent>
      </Dialog>
    </SectionWrapper>
  );
}
