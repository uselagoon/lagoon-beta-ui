import React from 'react';

import addOrUpdateRouteOnEnvironment from '@/lib/mutation/addOrUpdateRouteOnEnvironment';
import { useMutation } from '@apollo/client';
import { Sheet, Tooltip, TooltipContent, TooltipTrigger } from '@uselagoon/ui-library';
import { UserRoundPlus, PlusCircle, Link } from 'lucide-react';
import { toast } from 'sonner';
import { ProjectEnvironment } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/(project-overview)/page';
import { routeTypeOptions } from '../shared/selectOptions';

const AttachRouteSheet = ({
  projectName,
  domainName,
  environments,
  prodEnvironment,
  standbyEnvironment,
  iconOnly = false,
}: {
  projectName?: string;
  domainName?: string;
  environments: ProjectEnvironment[]
  prodEnvironment?: string;
  standbyEnvironment?: string;
  iconOnly?: boolean;
}) => {
  const [addOrUpdateRoute, { error, loading }] = useMutation(addOrUpdateRouteOnEnvironment, {
    onCompleted: () => {
      toast.success('Attached route successfully');
    },
    refetchQueries: ['getProject'],
  });
  const handleAttachRoute = async (e: React.MouseEvent<HTMLButtonElement>, values: any) => {
    try {
      const { environment, service, primary, type } = values;
      let primaryBool = Boolean(primary);
      if (primary != true) {
        primaryBool = false
      }
      await addOrUpdateRoute({
        variables: {
          domain: domainName,
          project: projectName,
          environment: environment,
          service: service,
          primary: primaryBool,
          type: type,
        },
      });

    } catch (err) {
      console.error('Error attaching route:', err);
      return false;
    }
  };

  const options = environments.map(env => ({
    label: (env.name == standbyEnvironment ? (env.name + " (standby)") : (env.name == prodEnvironment ? (env.name + " (production)") : (env.name))),
    value: env.name,
  }));

  type sheetFields = {
    id: string;
    label: string;
    inputDefault?: string | undefined;
    type?: string | undefined;
    placeholder?: string | undefined;
    required?: boolean | undefined;
    options?: any;
    readOnly?: boolean;
    triggerFieldUpdate?: boolean;
    validate?: (value: string | boolean) => string | null;
}[]

  const sheetFields: sheetFields = [
    {
      id: 'environment',
      label: 'Name of the environment',
      type: 'select',
      placeholder: 'Select environment',
      required: true,
      options: options,
    },
    {
      id: 'service',
      label: 'Name of the service to attach to',
      type: 'text',
      placeholder: 'Enter service name',
      required: true,
    },
  ]
  if (standbyEnvironment) {
    sheetFields.push(
      {
        id: 'type',
        label: 'Route type',
        placeholder: 'Select the route type',
        type: 'select',
        inputDefault: 'STANDARD',
        options: routeTypeOptions,
      }
    )
  }
  sheetFields.push(
    {
      id: 'primary',
      label: 'Primary route',
      type: 'checkbox',
      inputDefault: 'false',
    }
  )

  return (
    <div className="space-y-4">
      <Sheet
        sheetTrigger={iconOnly ?           <Tooltip>
            <TooltipTrigger>
              <Link className="h-5 w-5" />
            </TooltipTrigger>
            <TooltipContent>Attach route to environment</TooltipContent>
          </Tooltip> : 'Attach'}
        sheetTitle="Attach route to environment"
        sheetDescription={`Add ${domainName}`}
        sheetFooterButton="Confirm"
        loading={loading}
        error={!!error}
        buttonAction={handleAttachRoute}
        sheetFields={sheetFields}
        additionalContent={
          <>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-sm">
              <p className="text-blue-800">
                <strong>Note:</strong> Only one route can be the primary route per environment, if one is already set,
                  then the existing primary route will be unset.
              </p>
            </div>
            {error && (
              <div className="text-red-500 p-3 mt-2 border border-red-300 rounded-md bg-red-50">
                <strong>Error attaching route:</strong> {error.message}
              </div>
            )}
          </>
        }
      />
    </div>
  );
};

export default AttachRouteSheet;
