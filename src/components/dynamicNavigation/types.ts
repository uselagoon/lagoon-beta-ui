export type EnvWithProblemsType = {
  environment: {
    id: string;
    name: string;
    openshiftProjectName: string;
    project: {
      id: string;
      name: string;
      problemsUi: number;
      factsUi: number;
    };
    problems: {
      id: string;
      identifier: string;
      environment: {
        id: string;
        name: string;
      };
      data: Record<string, any> | null;
      severity: string | null;
      source: string | null;
      service: string | null;
      created: string;
      deleted: string | null;
      severityScore: number | null;
      associatedPackage: string | null;
      description: string | null;
      version: string | null;
      fixedVersion: string | null;
      links: string[] | null;
    }[];
    pendingChanges: {
      type: string;
      details: string;
      date: string;
    }[];
  } | null;
};
