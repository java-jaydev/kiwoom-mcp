import { z } from "zod";
import { KiwoomConfig, formatNumber, formatAbs } from "../types.js";
import { callApi } from "../client.js";

export const stockPriceSchema = z.object({
  stockCode: z.string().length(6).describe("종목코드 (6자리, 예: 005930)"),
});

export async function getStockPrice(config: KiwoomConfig, input: z.infer<typeof stockPriceSchema>) {
  const data = await callApi(config, "ka10001", "/api/dostk/stkinfo", {
    stk_cd: input.stockCode,
  });

  return {
    종목코드: data.stk_cd as string,
    종목명: data.stk_nm as string,
    현재가: formatAbs(data.cur_prc as string),
    전일대비: formatNumber(data.fluc_prc as string),
    등락률: data.fluc_rt as string,
    거래량: formatNumber(data.trd_vol as string),
    시가: formatAbs(data.open_pric as string),
    고가: formatAbs(data.high_pric as string),
    저가: formatAbs(data.low_pric as string),
    PER: data.per as string,
    PBR: data.pbr as string,
    EPS: formatNumber(data.eps as string),
    BPS: formatNumber(data.bps as string),
    ROE: data.roe as string,
    시가총액_억: formatNumber(data.mac as string),
    "52주최고": formatAbs(data["250hgst"] as string),
    "52주최저": formatAbs(data["250lwst"] as string),
    외국인소진율: formatAbs(data.for_exh_rt as string),
    상한가: formatAbs(data.upl_pric as string),
    하한가: formatAbs(data.lst_pric as string),
  };
}
