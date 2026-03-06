import { z } from "zod";
import { KiwoomConfig, formatNumber } from "../types.js";
import { callApi } from "../client.js";

export const investorTrendSchema = z.object({
  stockCode: z
    .string()
    .length(6)
    .optional()
    .describe("종목코드 (6자리, 미입력 시 상위 100종목 반환)"),
});

interface TrendItem {
  stk_cd: string;
  stk_nm: string;
  cur_prc: string;
  pred_pre: string;
  flu_rt: string;
  trde_qty: string;
  ind_invsr: string;
  frgnr_invsr: string;
  orgn: string;
  fnnc_invt: string;
  insrnc: string;
  invtrt: string;
  penfnd_etc: string;
  samo_fund: string;
  bank: string;
}

function formatItem(item: TrendItem) {
  return {
    종목코드: item.stk_cd,
    종목명: item.stk_nm,
    현재가: formatNumber(item.cur_prc),
    전일대비: item.pred_pre,
    등락률: item.flu_rt,
    거래량: formatNumber(item.trde_qty),
    개인: formatNumber(item.ind_invsr),
    외국인: formatNumber(item.frgnr_invsr),
    기관: formatNumber(item.orgn),
    금융투자: formatNumber(item.fnnc_invt),
    보험: formatNumber(item.insrnc),
    투신: formatNumber(item.invtrt),
    연기금: formatNumber(item.penfnd_etc),
    사모펀드: formatNumber(item.samo_fund),
    은행: formatNumber(item.bank),
  };
}

export async function getInvestorTrend(
  config: KiwoomConfig,
  input: z.infer<typeof investorTrendSchema>,
) {
  const data = await callApi(config, "ka10066", "/api/dostk/mrkcond", {
    stk_cd: input.stockCode ?? "",
    mrkt_tp: "KRX",
    amt_qty_tp: "1",
    trde_tp: "0",
    stex_tp: "0",
  });

  const items = (data.opaf_invsr_trde as TrendItem[] | undefined) ?? [];

  if (input.stockCode) {
    const target = items.find((item) => item.stk_cd === input.stockCode);
    if (target) {
      return formatItem(target);
    }
    return {
      메시지: `${input.stockCode} 종목이 당일 투자자별 매매동향 상위 100에 포함되지 않습니다.`,
    };
  }

  return items.map(formatItem);
}
