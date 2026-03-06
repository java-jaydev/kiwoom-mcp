import { z } from "zod";
import { KiwoomConfig } from "../types.js";
import { callApi } from "../client.js";

export const investorTrendSchema = z.object({
  stockCode: z.string().length(6).describe("종목코드 (6자리)"),
});

interface TrendItem {
  dt: string;
  frgn_net: string;
  frgn_rt: string;
  inst_net: string;
  indv_net: string;
  fin_net: string;
  ins_net: string;
  trs_net: string;
  pen_net: string;
  prf_net: string;
  bnk_net: string;
}

export async function getInvestorTrend(
  config: KiwoomConfig,
  input: z.infer<typeof investorTrendSchema>,
) {
  const data = await callApi(config, "ka10066", "/api/dostk/mrkcond", {
    stk_cd: input.stockCode,
    mrkt_tp: "KRX",
  });

  const items = (data.output as TrendItem[] | undefined) ?? [];

  return items.map((item) => ({
    날짜: item.dt,
    외국인순매수: item.frgn_net,
    외국인보유율: item.frgn_rt,
    기관순매수: item.inst_net,
    개인순매수: item.indv_net,
    금융투자순매수: item.fin_net,
    보험순매수: item.ins_net,
    투신순매수: item.trs_net,
    연기금순매수: item.pen_net,
    사모순매수: item.prf_net,
    은행순매수: item.bnk_net,
  }));
}
