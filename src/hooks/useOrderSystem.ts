import { useState, useCallback, useEffect } from "react";
import type { Order, Bot, OrderType } from "../types";

export const useOrderSystem = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [bots, setBots] = useState<Bot[]>([]);
  const [nextOrderId, setNextOrderId] = useState(1);
  const [nextBotId, setNextBotId] = useState(1);

  const addOrder = useCallback(
    (type: OrderType) => {
      const newOrder: Order = {
        id: nextOrderId,
        type,
        status: "PENDING",
      };
      setOrders((prevOrders) => {
        const pendingOrders = prevOrders.filter(
          (order) => order.status === "PENDING"
        );
        const completedOrders = prevOrders.filter(
          (order) => order.status === "COMPLETE"
        );

        if (type === "VIP") {
          const lastVipIndex = [...pendingOrders]
            .reverse()
            .findIndex((order) => order.type === "VIP");
          const insertIndex =
            lastVipIndex === -1 ? 0 : pendingOrders.length - lastVipIndex;
          pendingOrders.splice(insertIndex, 0, newOrder);
        } else {
          pendingOrders.push(newOrder);
        }

        return [...pendingOrders, ...completedOrders];
      });
      setNextOrderId((prev) => prev + 1);
    },
    [nextOrderId]
  );

  const addBot = useCallback(() => {
    const newBot: Bot = {
      id: nextBotId,
      isIdle: true,
    };
    setBots((prev) => [...prev, newBot]);
    setNextBotId((prev) => prev + 1);
  }, [nextBotId]);

  const removeBot = useCallback(() => {
    setBots((prev) => {
      if (prev.length === 0) return prev;
      const lastBot = prev[prev.length - 1];
      if (lastBot.currentOrderId) {
        setOrders((orders) =>
          orders.map((order) =>
            order.id === lastBot.currentOrderId
              ? { ...order, status: "PENDING", botId: undefined }
              : order
          )
        );
        console.log("removeBot", lastBot);
        if (lastBot.timer) clearTimeout(lastBot.timer);
      }
      return prev.slice(0, -1);
    });
  }, []);

  useEffect(() => {
    const processOrders = () => {
      setBots((prevBots) => {
        return prevBots.map((bot) => {
          if (!bot.isIdle) return bot;
          console.log("order", orders);
          const pendingOrder = orders.find(
            (order) => order.status === "PENDING" && !order.botId
          );
          if (pendingOrder) {
            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order.id === pendingOrder.id
                  ? { ...order, botId: bot.id }
                  : order
              )
            );
            const timer = setTimeout(() => {
              setOrders((prevOrders) =>
                prevOrders.map((order) =>
                  order.id === pendingOrder.id && order.botId === bot.id
                    ? { ...order, status: "COMPLETE", botId: bot.id }
                    : order
                )
              );
              setBots((prevBots) =>
                prevBots.map((b) =>
                  b.id === bot.id
                    ? { ...b, isIdle: true, currentOrderId: undefined }
                    : b
                )
              );
            }, 10000);

            return {
              ...bot,
              isIdle: false,
              currentOrderId: pendingOrder.id,
              timer,
            };
          }

          return bot;
        });
      });
    };

    const interval = setInterval(processOrders, 1000);
    return () => clearInterval(interval);
  }, [orders]);

  return {
    orders,
    bots,
    addOrder,
    addBot,
    removeBot,
  };
};
