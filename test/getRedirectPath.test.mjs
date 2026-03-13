import assert from 'node:assert/strict';
import test from 'node:test';

import { getRedirectPath } from '../src/lib/auth/getRedirectPath.ts';

test('preserves a direct relative path', () => {
  assert.equal(
    getRedirectPath('/projects/example/example-main/deployments/lagoon-build-abcdefg'),
    '/projects/example/example-main/deployments/lagoon-build-abcdefg'
  );
});

test('converts an absolute callback URL into an in-app path', () => {
  assert.equal(
    getRedirectPath('http://0.0.0.0:3000/projects/example/example-main/deployments/lagoon-build-abcdefg?tab=logs'),
    '/projects/example/example-main/deployments/lagoon-build-abcdefg?tab=logs'
  );
});

test('falls back to the app root for invalid or unsafe callback URLs', () => {
  assert.equal(getRedirectPath(null), '/');
  assert.equal(getRedirectPath('//external.example/path'), '/');
  assert.equal(getRedirectPath('not a valid url'), '/');
});
