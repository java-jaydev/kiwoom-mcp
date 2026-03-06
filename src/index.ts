#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { KiwoomConfig } from "./types.js";
import { stockPriceSchema, getStockPrice } from "./tools/stock-price.js";
import { orderbookSchema, getOrderbook } from "./tools/orderbook.js";
import { dailyChartSchema, getDailyChart } from "./tools/daily-chart.js";
import { investorTrendSchema, getInvestorTrend } from "./tools/investor-trend.js";
import { getAccountBalance } from "./tools/account-balance.js";
import { getDeposit } from "./tools/deposit.js";
import { getUnfilledOrders } from "./tools/unfilled-orders.js";
import { filledOrdersSchema, getFilledOrders } from "./tools/filled-orders.js";

const config: KiwoomConfig = {
  appKey: process.env.KIWOOM_APP_KEY ?? "",
  secretKey: process.env.KIWOOM_SECRET_KEY ?? "",
  baseUrl: process.env.KIWOOM_API_BASE_URL ?? "https://api.kiwoom.com",
};

if (!config.appKey || !config.secretKey) {
  console.error("[kiwoom-mcp] KIWOOM_APP_KEY, KIWOOM_SECRET_KEY 환경변수가 필요합니다.");
  process.exit(1);
}

const server = new McpServer({
  name: "kiwoom-mcp",
  version: "1.0.0",
});

// 현재가 조회
server.tool(
  "get_stock_price",
  "주식 현재가 조회 (종목명, 현재가, 등락률, PER, PBR 등)",
  stockPriceSchema.shape,
  async ({ stockCode }) => ({
    content: [{ type: "text", text: JSON.stringify(await getStockPrice(config, { stockCode }), null, 2) }],
  }),
);

// 호가 조회
server.tool(
  "get_orderbook",
  "주식 호가 조회 (매도/매수 1~10호가, 잔량)",
  orderbookSchema.shape,
  async ({ stockCode }) => ({
    content: [{ type: "text", text: JSON.stringify(await getOrderbook(config, { stockCode }), null, 2) }],
  }),
);

// 일봉 차트
server.tool(
  "get_daily_chart",
  "일봉 차트 조회 (날짜별 시/고/저/종가, 거래량)",
  dailyChartSchema.shape,
  async ({ stockCode, baseDate }) => ({
    content: [{ type: "text", text: JSON.stringify(await getDailyChart(config, { stockCode, baseDate }), null, 2) }],
  }),
);

// 투자자별 매매동향
server.tool(
  "get_investor_trend",
  "투자자별 매매동향 조회 (외국인/기관/개인 순매수)",
  investorTrendSchema.shape,
  async ({ stockCode }) => ({
    content: [{ type: "text", text: JSON.stringify(await getInvestorTrend(config, { stockCode }), null, 2) }],
  }),
);

// 계좌평가현황
server.tool(
  "get_account_balance",
  "계좌평가현황 조회 (예수금, 보유종목, 평가금액, 손익률)",
  {},
  async () => ({
    content: [{ type: "text", text: JSON.stringify(await getAccountBalance(config), null, 2) }],
  }),
);

// 예수금 조회
server.tool(
  "get_deposit",
  "예수금 상세 조회 (예수금, 출금가능, 주문가능금액)",
  {},
  async () => ({
    content: [{ type: "text", text: JSON.stringify(await getDeposit(config), null, 2) }],
  }),
);

// 미체결 주문
server.tool(
  "get_unfilled_orders",
  "미체결 주문 조회",
  {},
  async () => ({
    content: [{ type: "text", text: JSON.stringify(await getUnfilledOrders(config), null, 2) }],
  }),
);

// 체결 내역
server.tool(
  "get_filled_orders",
  "체결 내역 조회 (종목코드 미입력 시 전체 조회)",
  filledOrdersSchema.shape,
  async ({ stockCode }) => ({
    content: [{ type: "text", text: JSON.stringify(await getFilledOrders(config, { stockCode }), null, 2) }],
  }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[kiwoom-mcp] 서버 시작됨");
}

main().catch((error) => {
  console.error("[kiwoom-mcp] 서버 시작 실패:", error);
  process.exit(1);
});
