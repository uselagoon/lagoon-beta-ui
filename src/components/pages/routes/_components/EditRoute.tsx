import { FC } from 'react';
import { useMutation } from '@apollo/client';
import { Sheet, Tooltip, TooltipContent, TooltipTrigger } from '@uselagoon/ui-library';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';
import addOrUpdateRouteOnEnvironment from '@/lib/mutation/addOrUpdateRouteOnEnvironment';
import { routeTypeOptions } from '@/components/shared/selectOptions';


type Props = {
  variant?: 'default' | 'small';
  projectName: string;
  environmentName: string;
  domainName: string;
  refetch?: () => void;
  iconOnly?: boolean;
  primary?: boolean;
  routeType?: string;
  service: string;
  standbyEnvironment?: string;
};

export const EditRoute: FC<Props> = props => {

  return (
    <>
      <div className="flex gap-2 items-center">
        <EditRouteSheet
          projectName={props.projectName}
          environmentName={props.environmentName}
          domainName={props.domainName}
          iconOnly={props.iconOnly}
          primary={props.primary}
          routeType={props.routeType}
          service={props.service}
          standbyEnvironment={props.standbyEnvironment}
        />
      </div>
    </>
  );
};

const EditRouteSheet = ({
  projectName,
  domainName,
  environmentName,
  standbyEnvironment,
  primary = false,
  routeType,
  service,
  iconOnly = false,
}: {
  projectName?: string;
  domainName?: string;
  environmentName: string;
  standbyEnvironment?: string;
  primary?: boolean;
  routeType?: string;
  service?: string;
  iconOnly?: boolean;
}) => {
  const [addOrUpdateRoute, { error, loading }] = useMutation(addOrUpdateRouteOnEnvironment, {
    onCompleted: () => {
      toast.success('Updated route successfully');
    },
    refetchQueries: ['getProject'],
  });
  const handleUpdateRoute = async (e: React.MouseEvent<HTMLButtonElement>, values: any) => {
    try {
      const { service, primary, type } = values;
      let primaryBool = Boolean(primary);
      if (primary != true) {
        primaryBool = false
      }
      await addOrUpdateRoute({
        variables: {
          domain: domainName,
          project: projectName,
          environment: environmentName,
          service: service,
          primary: primaryBool,
          type: type,
        },
      });

    } catch (err) {
      console.error('Error updating route:', err);
      return false;
    }
  };

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
      id: 'service',
      label: 'Name of the service to attach to',
      type: 'text',
      placeholder: 'Enter service name',
      required: true,
      inputDefault: service
    },
  ]
  if (standbyEnvironment) {
    sheetFields.push(
      {
        id: 'type',
        label: 'Route type',
        placeholder: 'Select the route type',
        type: 'select',
        inputDefault: routeType?.toUpperCase(),
        options: routeTypeOptions,
      }
    )
  }
  sheetFields.push(
    {
      id: 'primary',
      label: 'Primary route',
      type: 'checkbox',
      inputDefault: primary.toString(),
    }
  )

  return (
    <div className="space-y-4">
      <Sheet
        sheetTrigger={iconOnly ?           <Tooltip>
            <TooltipTrigger>
              <Pencil className="h-5 w-5" />
            </TooltipTrigger>
            <TooltipContent>Update route on environment</TooltipContent>
          </Tooltip> : 'Update'}
        sheetTitle="Update route on an environment"
        sheetDescription={`Update ${domainName}`}
        sheetFooterButton="Confirm"
        loading={loading}
        error={!!error}
        buttonAction={handleUpdateRoute}
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
                <strong>Error updating route:</strong> {error.message}
              </div>
            )}
          </>
        }
      />
    </div>
  );
};
