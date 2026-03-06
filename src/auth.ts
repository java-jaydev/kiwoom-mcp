import { KiwoomConfig, TokenInfo, TokenResponse, KiwoomApiError } from "./types.js";

const TOKEN_REFRESH_MARGIN_MS = 60 * 60 * 1000; // 1시간 전 갱신

let cachedToken: TokenInfo | null = null;

function parseExpiresAt(expiresDt: string): Date {
  // yyyyMMddHHmmss → Date
  const y = expiresDt.slice(0, 4);
  const M = expiresDt.slice(4, 6);
  const d = expiresDt.slice(6, 8);
  const h = expiresDt.slice(8, 10);
  const m = expiresDt.slice(10, 12);
  const s = expiresDt.slice(12, 14);
  return new Date(`${y}-${M}-${d}T${h}:${m}:${s}+09:00`);
}

function isTokenValid(): boolean {
  if (!cachedToken) return false;
  const now = Date.now();
  return now < cachedToken.expiresAt.getTime() - TOKEN_REFRESH_MARGIN_MS;
}

async function fetchToken(config: KiwoomConfig): Promise<TokenInfo> {
  const res = await fetch(`${config.baseUrl}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "api-id": "au10001",
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      appkey: config.appKey,
      secretkey: config.secretKey,
    }),
  });

  if (!res.ok) {
    throw new KiwoomApiError(-1, `HTTP ${res.status}: ${res.statusText}`);
  }

  const data = (await res.json()) as TokenResponse;

  if (data.return_code !== 0) {
    throw new KiwoomApiError(data.return_code, data.return_msg);
  }

  const tokenInfo: TokenInfo = {
    token: data.token,
    expiresAt: parseExpiresAt(data.expires_dt),
  };

  console.error(`[auth] 토큰 발급 완료, 만료: ${data.expires_dt}`);
  return tokenInfo;
}

export async function ensureAuthenticated(config: KiwoomConfig): Promise<string> {
  if (isTokenValid()) {
    return cachedToken!.token;
  }

  console.error("[auth] 토큰 발급/갱신 중...");
  cachedToken = await fetchToken(config);
  return cachedToken.token;
}
