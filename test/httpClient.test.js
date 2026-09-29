import test from 'node:test';
import assert from 'node:assert/strict';
import { createHttpClient, HttpError } from '../src/api/httpClient.js';

const json = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  text: async () => (body === undefined ? '' : JSON.stringify(body)),
});

const silence = (t) => t.mock.method(console, 'warn', () => {});

test('returns parsed JSON on success', async () => {
  const http = createHttpClient({ baseUrl: '', getToken: () => 't', fetchImpl: async () => json(200, { ok: 1 }) });
  assert.deepEqual(await http.get('/x'), { ok: 1 });
});

test('retries on network failure and eventually succeeds', async (t) => {
  silence(t);
  let calls = 0;
  const fetchImpl = async () => {
    calls++;
    if (calls < 3) throw new TypeError('Failed to fetch');
    return json(200, { id: 'c1' });
  };
  const http = createHttpClient({ baseUrl: '', getToken: () => 't', fetchImpl });
  assert.deepEqual(await http.get('/contacts/c1'), { id: 'c1' });
  assert.equal(calls, 3);
});

test('gives up after max retries', async (t) => {
  silence(t);
  const http = createHttpClient({
    baseUrl: '',
    getToken: () => 't',
    fetchImpl: async () => json(503, { error: 'unavailable' }),
    retry: { retries: 2, baseDelayMs: 1 },
  });
  await assert.rejects(http.get('/x'), HttpError);
});

test('refreshes the token on 401 and replays the request', async () => {
  let calls = 0;
  let refreshed = 0;
  const http = createHttpClient({
    baseUrl: '',
    getToken: () => 'token',
    refreshToken: async () => { refreshed++; },
    fetchImpl: async () => (calls++ === 0 ? json(401) : json(200, { ok: true })),
  });
  assert.deepEqual(await http.get('/me'), { ok: true });
  assert.equal(refreshed, 1);
});
