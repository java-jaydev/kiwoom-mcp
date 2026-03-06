import { z } from "zod";
import { KiwoomConfig } from "../types.js";
import { callApi } from "../client.js";

export const filledOrdersSchema = z.object({
  stockCode: z.string().length(6).optional().describe("종목코드 (6자리, 미입력 시 전체 조회)"),
});

interface FilledItem {
  ord_no: string;
  stk_cd: string;
  stk_nm: string;
  ord_qty: string;
  ord_uv: string;
  fld_qty: string;
  fld_uv: string;
  ord_tp: string;
  ord_tm: string;
  fld_tm: string;
}

export async function getFilledOrders(
  config: KiwoomConfig,
  input: z.infer<typeof filledOrdersSchema>,
) {
  const stockCode = input.stockCode ?? "";

  const data = await callApi(config, "ka10076", "/api/dostk/acnt", {
    stk_cd: stockCode,
    qry_tp: stockCode ? "1" : "0",
    sell_tp: "0",
    ord_no: "",
    stex_tp: "0",
  });

  const items = ((data.output as FilledItem[] | undefined) ?? []).map((item) => ({
    주문번호: item.ord_no,
    종목코드: item.stk_cd,
    종목명: item.stk_nm,
    주문수량: item.ord_qty,
    주문가격: item.ord_uv,
    체결수량: item.fld_qty,
    체결가격: item.fld_uv,
    주문구분: item.ord_tp,
    주문시간: item.ord_tm,
    체결시간: item.fld_tm,
  }));

  return { 체결내역: items };
}
