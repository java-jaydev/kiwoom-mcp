import { KiwoomConfig } from "../types.js";
import { callApi } from "../client.js";

interface UnfilledItem {
  ord_no: string;
  stk_cd: string;
  stk_nm: string;
  ord_qty: string;
  ord_uv: string;
  unfld_qty: string;
  ord_tp: string;
  ord_tm: string;
}

export async function getUnfilledOrders(config: KiwoomConfig) {
  const data = await callApi(config, "ka10075", "/api/dostk/acnt", {
    all_stk_tp: "0",
    trde_tp: "0",
    stk_cd: "",
    stex_tp: "0",
  });

  const items = ((data.output as UnfilledItem[] | undefined) ?? []).map((item) => ({
    주문번호: item.ord_no,
    종목코드: item.stk_cd,
    종목명: item.stk_nm,
    주문수량: item.ord_qty,
    주문가격: item.ord_uv,
    미체결수량: item.unfld_qty,
    주문구분: item.ord_tp,
    주문시간: item.ord_tm,
  }));

  return { 미체결주문: items };
}
