import { useCloneStatusContext } from '@/contexts/CloneStatusContext';

export function useCloneStatus(projectName: string) {
  const { getCloneStatus, isCloning, isActionsDisabled } = useCloneStatusContext();
  return {
    status: getCloneStatus(projectName),
    isCloning: isCloning(projectName),
    isActionsDisabled: isActionsDisabled(projectName),
  };
}

export function useRegisterClone() {
  const { registerClone } = useCloneStatusContext();
  return registerClone;
}

export function useUnregisterClone() {
  const { unregisterClone } = useCloneStatusContext();
  return unregisterClone;
}
