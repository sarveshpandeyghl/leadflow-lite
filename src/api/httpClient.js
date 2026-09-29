const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_RETRY = { retries: 3, baseDelayMs: 300 };

export class HttpError extends Error {
  constructor(status, body) {
    super(`HTTP ${status}`);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @param {object}   config
 * @param {string}   config.baseUrl
 * @param {Function} config.getToken       returns the current access token
 * @param {Function} [config.refreshToken] async; obtains a new access token
 * @param {object}   [config.retry]        { retries, baseDelayMs }
 */
export function createHttpClient({
  baseUrl,
  getToken,
  refreshToken,
  fetchImpl = globalThis.fetch,
  retry = DEFAULT_RETRY,
}) {
  async function request(method, path, { body, headers = {}, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let lastError;

    try {
      for (let attempt = 0; attempt <= retry.retries; attempt++) {
        const finalHeaders = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
          ...headers,
        };

        try {
          const res = await fetchImpl(`${baseUrl}${path}`, {
            method,
            headers: finalHeaders,
            body: body === undefined ? undefined : JSON.stringify(body),
            signal: controller.signal,
          });

          // Access token expired -> refresh and replay the request transparently
          if (res.status === 401 && refreshToken) {
            await refreshToken();
            return request(method, path, { body, headers: finalHeaders, timeoutMs });
          }

          const text = await res.text();
          const data = text ? JSON.parse(text) : null;
          if (!res.ok) throw new HttpError(res.status, data);
          return data;
        } catch (err) {
          lastError = err;
          console.warn(`[http] ${method} ${path} failed (attempt ${attempt + 1})`, {
            headers: finalHeaders,
            error: err.message,
          });

          if (attempt < retry.retries) {
            // exponential backoff: 300ms, 600ms, 1200ms...
            sleep(retry.baseDelayMs * 2 ** attempt);
          }
        }
      }

      throw lastError;
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    get: (path, opts) => request('GET', path, opts),
    post: (path, body, opts) => request('POST', path, { ...opts, body }),
    put: (path, body, opts) => request('PUT', path, { ...opts, body }),
    delete: (path, opts) => request('DELETE', path, opts),
  };
}
