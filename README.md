# kiwoom-mcp

키움증권 REST API를 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 도구로 래핑한 서버입니다.
Claude Code 등 MCP를 지원하는 LLM 클라이언트에서 한국 주식 정보를 직접 조회할 수 있습니다.

> **현재 버전은 조회 전용입니다.** 주문(매수/매도/취소) 기능은 포함되어 있지 않습니다.

---

## 면책 조항 (Disclaimer)

> **이 소프트웨어를 사용함으로써 발생하는 모든 결과에 대한 책임은 전적으로 사용자 본인에게 있습니다.**

- 이 프로젝트는 **개인 학습 및 편의 목적**으로 제작되었으며, 키움증권의 공식 제품이 아닙니다.
- **투자 조언, 매매 권유, 또는 수익 보장을 하지 않습니다.**
- API 호출로 인한 과금, 데이터 오류, 계좌 정보 노출, 토큰 유출 등 **어떠한 직접적·간접적 손해에 대해서도 제작자는 책임지지 않습니다.**
- 키움증권 OpenAPI 이용 약관을 반드시 확인하고, 본인의 책임 하에 사용하세요.
- API 키와 시크릿 키는 **절대 공개 저장소에 커밋하지 마세요.** 환경변수 또는 `.env` 파일로 관리하세요.
- 이 도구를 통해 조회한 데이터의 정확성을 보장하지 않습니다. 실제 투자 판단은 반드시 공식 HTS/MTS를 통해 확인하세요.

---

## 사전 준비

1. **키움증권 OpenAPI 신청**: [키움 OpenAPI 포털](https://openapi.kiwoom.com/)에서 REST API 사용 신청
2. **App Key / Secret Key 발급**: OpenAPI 포털에서 발급
3. **Node.js 18+** 설치

---

## 제공 도구

| 도구명 | 설명 | 입력 파라미터 |
|--------|------|---------------|
| `get_stock_price` | 현재가 조회 (종목명, 등락률, PER, PBR 등) | `stockCode` (6자리) |
| `get_orderbook` | 호가 조회 (매도/매수 1~10호가, 잔량) | `stockCode` |
| `get_daily_chart` | 일봉 차트 (시/고/저/종가, 거래량) | `stockCode`, `baseDate?` (YYYYMMDD) |
| `get_investor_trend` | 투자자별 매매동향 (외국인/기관/개인 순매수) | `stockCode` |
| `get_account_balance` | 계좌평가현황 (예수금, 보유종목, 손익률) | 없음 |
| `get_deposit` | 예수금 상세 조회 (출금가능, 주문가능금액) | 없음 |
| `get_unfilled_orders` | 미체결 주문 조회 | 없음 |
| `get_filled_orders` | 체결 내역 조회 | `stockCode?` (미입력 시 전체) |

---

## 설치

```bash
git clone https://github.com/java-jaydev/kiwoom-mcp.git
cd kiwoom-mcp
pnpm install
pnpm run build
```

> `pnpm`이 없으면 `npm install && npm run build`로도 가능합니다.

---

## 환경변수

| 변수명 | 필수 | 설명 |
|--------|------|------|
| `KIWOOM_APP_KEY` | O | 키움 OpenAPI App Key |
| `KIWOOM_SECRET_KEY` | O | 키움 OpenAPI Secret Key |
| `KIWOOM_API_BASE_URL` | X | API 베이스 URL (기본값: `https://api.kiwoom.com`) |

---

## Claude Code 연동

### 방법 1: CLI 명령어 (권장)

```bash
claude mcp add --transport stdio --scope user kiwoom \
  --env KIWOOM_APP_KEY=<your-app-key> \
  --env KIWOOM_SECRET_KEY=<your-secret-key> \
  -- node /path/to/kiwoom-mcp/dist/index.js
```

### 방법 2: .mcp.json (프로젝트 스코프)

프로젝트 루트에 `.mcp.json` 생성:

```json
{
  "mcpServers": {
    "kiwoom": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/kiwoom-mcp/dist/index.js"],
      "env": {
        "KIWOOM_APP_KEY": "<your-app-key>",
        "KIWOOM_SECRET_KEY": "<your-secret-key>"
      }
    }
  }
}
```

> `.mcp.json`에 API 키가 포함되므로 반드시 `.gitignore`에 추가하세요.

설정 후 Claude Code를 재시작하고 `/mcp` 명령어로 서버 연결을 확인합니다.

---

## 검증

```bash
# MCP Inspector로 로컬 테스트
npx @modelcontextprotocol/inspector node dist/index.js

# Claude Code에서 연동 확인
# /mcp 명령어로 서버 상태 확인 후 "삼성전자 현재가 알려줘" 등 질의
```

---

## 주의사항

- **IP 제한**: 키움 API 토큰은 발급된 IP에서만 유효합니다. 서버와 클라이언트가 같은 IP에서 실행되어야 합니다.
- **토큰 관리**: 토큰 유효기간 24시간, 만료 1시간 전 자동 갱신됩니다.
- **장 운영시간**: 장 마감 후에는 시가/고가/저가가 0으로 반환될 수 있습니다.
- **가격 부호**: 키움 API 응답의 가격에는 `+`/`-` 부호가 붙으며, 현재가 등은 절대값으로 변환하여 반환합니다.
- **Rate Limit**: 키움 API의 호출 제한을 준수하세요. 과도한 호출은 차단될 수 있습니다.

---

## 기술 스택

- TypeScript + Node.js (ES Module)
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk)
- [Zod](https://github.com/colinhacks/zod) (입력 검증)
- Stdio Transport

---

## 라이선스

MIT License

---

## 기여

이슈와 PR을 환영합니다. 단, **API 키나 시크릿 키가 포함된 커밋은 절대 하지 마세요.**
