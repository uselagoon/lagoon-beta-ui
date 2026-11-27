export function hasAccess(
  userRoles: string[] | undefined,
  requiredRoles?: string[],
  excludeRoles?: string[]
): boolean {
  const roles = userRoles || [];
  if (excludeRoles?.length && excludeRoles.some(role => roles.includes(role))) return false;
  if (!requiredRoles?.length) return true;
  return requiredRoles.some(role => roles.includes(role));
}
