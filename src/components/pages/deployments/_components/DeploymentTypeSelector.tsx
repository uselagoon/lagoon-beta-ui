import { DeploymentType, deploymentOptions } from './DeployLatest';

export const DeploymentTypeSelector = ({
  value,
  onChange,
  disabledValues = [],
  disabled = false,
}: {
  value: DeploymentType;
  onChange: (value: DeploymentType) => void;
  disabledValues?: DeploymentType[];
  disabled?: boolean;
}) => {
  const selectableOptions = deploymentOptions.filter(option => !disabledValues.includes(option.value));

  const moveSelection = (direction: 1 | -1) => {
    const currentIndex = selectableOptions.findIndex(option => option.value === value);
    const next = selectableOptions[(currentIndex + direction + selectableOptions.length) % selectableOptions.length];
    if (next) {
      onChange(next.value);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Deployment type"
      className="inline-flex w-full gap-1 rounded-md bg-muted p-1 sm:w-auto"
      onKeyDown={event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault();
          moveSelection(1);
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault();
          moveSelection(-1);
        }
      }}
    >
      {deploymentOptions.map(option => {
        const Icon = option.icon;
        const isSelected = option.value === value;
        const isDisabled = disabled || disabledValues.includes(option.value);

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            disabled={isDisabled}
            onClick={() => onChange(option.value)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[0.3rem] px-4 py-2 text-sm font-medium whitespace-nowrap sm:flex-none sm:min-w-[10.5rem] transition-colors duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-45 ${
              isSelected
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground disabled:hover:text-muted-foreground'
            }`}
          >
            <Icon className={`size-4 shrink-0 ${isSelected ? 'text-[#3a8cff]' : 'text-current'}`} />
            {option.label}
          </button>
        );
      })}
    </div>
  );
};