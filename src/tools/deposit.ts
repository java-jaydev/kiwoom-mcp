import { KiwoomConfig } from "../types.js";
import { callApi } from "../client.js";

export async function getDeposit(config: KiwoomConfig) {
  const data = await callApi(config, "kt00001", "/api/dostk/acnt", {
    qry_tp: "3",
  });

  return {
    예수금: data.entr as string,
    출금가능금액: data.pymn_alow_amt as string,
    주문가능금액: data.ord_alow_amt as string,
    D2결제예정금액: data.d2_alow_amt as string,
  };
}
