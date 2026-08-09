import { signIn } from '../../../auth';
import { getRedirectPath } from '../../../lib/auth/getRedirectPath';

/**
 *
 * This route handler works with NextAuth 5 custom login page;
 * automatically takes the user to the provider login screen
 */

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  return signIn('keycloak',
    { redirectTo: getRedirectPath(searchParams.get('callbackUrl')) },
    { 'kc_idp_hint': searchParams.get('idpHint') ?? ''}
  );
}
