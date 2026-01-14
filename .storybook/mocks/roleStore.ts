import { UserRole } from '../types';

let currentRole: UserRole = 'OWNER';

export const setCurrentRole = (role: UserRole) => {
  currentRole = role;
};

export const getCurrentRole = (): UserRole => {
  return currentRole;
};

export const canViewVariableValues = (role: UserRole): boolean => {
  return role === 'OWNER' || role === 'MAINTAINER';
};
