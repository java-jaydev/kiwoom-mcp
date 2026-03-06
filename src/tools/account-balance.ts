import { KiwoomConfig } from "../types.js";
import { callApi } from "../client.js";

interface HoldingItem {
  stk_cd: string;
  stk_nm: string;
  rmnd_qty: string;
  avg_prc: string;
  cur_prc: string;
  evlt_amt: string;
  pl_amt: string;
  pl_rt: string;
  pur_amt: string;
}

export async function getAccountBalance(config: KiwoomConfig) {
  const data = await callApi(config, "kt00004", "/api/dostk/acnt", {
    qry_tp: "1",
    dmst_stex_tp: "KRX",
  });

  const holdings = ((data.stk_acnt_evlt_prst as HoldingItem[] | undefined) ?? []).map((item) => ({
    종목코드: item.stk_cd,
    종목명: item.stk_nm,
    보유수량: item.rmnd_qty,
    평균단가: item.avg_prc,
    현재가: item.cur_prc,
    평가금액: item.evlt_amt,
    손익금액: item.pl_amt,
    손익률: item.pl_rt,
    매입금액: item.pur_amt,
  }));

  return {
    예수금: data.entr as string,
    주식평가금액: data.stk_evlt_amt as string,
    총매입금액: data.tot_pur_amt as string,
    총자산: data.aset_evlt_amt as string,
    보유종목: holdings,
  };
}
