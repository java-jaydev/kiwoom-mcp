/**
 * 키움 API 공통 타입 정의
 */

export interface KiwoomConfig {
  appKey: string;
  secretKey: string;
  baseUrl: string;
}

export interface TokenInfo {
  token: string;
  expiresAt: Date;
}

export interface TokenResponse {
  token: string;
  token_type: string;
  expires_dt: string;
  return_code: number;
  return_msg: string;
}

export interface KiwoomApiResponse {
  return_code?: number;
  return_msg?: string;
  [key: string]: unknown;
}

export class KiwoomApiError extends Error {
  constructor(
    public readonly code: number,
    message: string,
  ) {
    super(`[${code}] ${message}`);
    this.name = "KiwoomApiError";
  }
}
