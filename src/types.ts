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

/**
 * 키움 API 응답값의 앞자리 0 패딩 제거 및 부호 정리
 * "000000028230" → "28,230"
 * "+553000" → "553,000"
 * "-00000009756" → "-9,756"
 */
export function formatNumber(raw: string | undefined | null): string {
  if (!raw) return "0";
  const cleaned = raw.replace(/^([+-]?)0+/, "$1") || "0";
  const match = cleaned.match(/^([+-]?)(\d+)(\.\d+)?$/);
  if (!match) return cleaned;
  const [, sign, integer, decimal] = match;
  const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}${formatted}${decimal ?? ""}`;
}

/** 부호 제거 후 포맷 (현재가 등 절대값) */
export function formatAbs(raw: string | undefined | null): string {
  if (!raw) return "0";
  return formatNumber(raw.replace(/^[+-]/, ""));
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
