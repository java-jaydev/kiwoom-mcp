import { z } from "zod";
import { KiwoomConfig } from "../types.js";
import { callApi } from "../client.js";

export const orderbookSchema = z.object({
  stockCode: z.string().length(6).describe("종목코드 (6자리)"),
});

export async function getOrderbook(config: KiwoomConfig, input: z.infer<typeof orderbookSchema>) {
  const data = await callApi(config, "ka10004", "/api/dostk/mrkcond", {
    stk_cd: input.stockCode,
  });

  const sellOrders = [];
  const buyOrders = [];

  for (let i = 1; i <= 10; i++) {
    sellOrders.push({
      호가: data[`sel_${i}_bid`] as string,
      잔량: data[`sel_${i}_req`] as string,
    });
    buyOrders.push({
      호가: data[`buy_${i}_bid`] as string,
      잔량: data[`buy_${i}_req`] as string,
    });
  }

  return {
    종목코드: input.stockCode,
    매도호가: sellOrders,
    매수호가: buyOrders,
    총매도잔량: data.tot_sel_qty as string,
    총매수잔량: data.tot_buy_qty as string,
  };
}
