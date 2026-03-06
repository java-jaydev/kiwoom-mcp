import { z } from "zod";
import { KiwoomConfig } from "../types.js";
import { callApi } from "../client.js";

export const dailyChartSchema = z.object({
  stockCode: z.string().length(6).describe("종목코드 (6자리)"),
  baseDate: z
    .string()
    .regex(/^\d{8}$/)
    .optional()
    .describe("기준일자 (YYYYMMDD, 이 날짜부터 과거 조회. 기본값: 오늘)"),
});

function todayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

interface ChartItem {
  dt: string;
  open_pric: string;
  high_pric: string;
  low_pric: string;
  cur_prc: string;
  trde_qty: string;
  trde_prica: string;
  pred_pre: string;
}

export async function getDailyChart(config: KiwoomConfig, input: z.infer<typeof dailyChartSchema>) {
  const data = await callApi(config, "ka10081", "/api/dostk/chart", {
    stk_cd: input.stockCode,
    base_dt: input.baseDate ?? todayString(),
    upd_stkpc_tp: "1",
  });

  const items = (data.stk_dt_pole_chart_qry as ChartItem[] | undefined) ?? [];

  return items.map((item) => ({
    날짜: item.dt,
    시가: item.open_pric,
    고가: item.high_pric,
    저가: item.low_pric,
    종가: item.cur_prc,
    거래량: item.trde_qty,
    거래대금: item.trde_prica,
    전일대비: item.pred_pre,
  }));
}
