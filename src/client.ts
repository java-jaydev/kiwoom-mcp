import { KiwoomConfig, KiwoomApiResponse, KiwoomApiError } from "./types.js";
import { ensureAuthenticated } from "./auth.js";

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 500;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(error: unknown): boolean {
  if (error instanceof KiwoomApiError) {
    // 토큰 만료, 일시적 서버 오류
    return error.code === -1 || error.code >= 500;
  }
  if (error instanceof TypeError) {
    // fetch 네트워크 오류
    return true;
  }
  return false;
}

export async function callApi(
  config: KiwoomConfig,
  apiId: string,
  uri: string,
  body: Record<string, string>,
): Promise<KiwoomApiResponse> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
      console.error(`[client] 재시도 ${attempt}/${MAX_RETRIES}, ${backoff}ms 대기`);
      await sleep(backoff);
    }

    try {
      const token = await ensureAuthenticated(config);

      const res = await fetch(`${config.baseUrl}${uri}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "api-id": apiId,
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new KiwoomApiError(-1, `HTTP ${res.status}: ${res.statusText}`);
      }

      const data = (await res.json()) as KiwoomApiResponse;

      if (data.return_code !== undefined && data.return_code !== 0) {
        throw new KiwoomApiError(data.return_code, data.return_msg ?? "Unknown error");
      }

      return data;
    } catch (error) {
      lastError = error;
      if (!isRetryable(error) || attempt === MAX_RETRIES) {
        break;
      }
    }
  }

  throw lastError;
}
