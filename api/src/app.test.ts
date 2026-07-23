import { describe, expect, it } from 'vitest';
import { createApp } from './app.ts';

// Integration tests run against a real Postgres service container in CI
// (specs/ci-obligations.md item 2); this is the wiring smoke test.
describe('app', () => {
  it('serves /healthz', async () => {
    const app = createApp();
    const server = app.listen(0);
    const address = server.address();
    if (address === null || typeof address === 'string') throw new Error('no port');
    const res = await fetch(`http://127.0.0.1:${address.port}/healthz`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    server.close();
  });
});
