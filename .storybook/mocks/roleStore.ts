import { UserRole } from '../types';

let currentRole: UserRole = 'owner';

export const setCurrentRole = (role: UserRole) => {
  currentRole = role;
};

export const getCurrentRole = (): UserRole => {
  return currentRole;
};
