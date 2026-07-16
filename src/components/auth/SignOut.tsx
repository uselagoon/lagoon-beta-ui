'use client';

import manualSignOut from '../../../utils/manualSignOut';

export function SignOutBtn() {
  return (
    <span
      data-testid="sign-out"
      onClick={() => {
        manualSignOut();
      }}
    >
      Sign Out
    </span>
  );
}
