export type OrderType = "NORMAL" | "VIP";

export interface Order {
  id: number;
  type: OrderType;
  status: "PENDING" | "COMPLETE";
  botId?: number;
}

export interface Bot {
  id: number;
  isIdle: boolean;
  currentOrderId?: number;
  timer?: any;
}
