/**
 * Fetch with automatic retry and exponential backoff.
 *
 * Fixes: delay now only increments between retries (not after success),
 * and no unnecessary sleep on the final failed attempt.
 */
export async function fetchWithRetry(url, options = {}, maxRetries = 3, baseDelay = 1000) {
  let lastError = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response;
    } catch (err) {
      lastError = err;
      // Sleep before next retry, but NOT after the final attempt
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, baseDelay * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError;
}
