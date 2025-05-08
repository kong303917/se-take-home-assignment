import { renderHook, act } from "@testing-library/react";
import { useOrderSystem } from "./useOrderSystem";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("useOrderSystem", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should add normal order to pending list", () => {
    const { result } = renderHook(() => useOrderSystem());

    act(() => {
      result.current.addOrder("NORMAL");
    });

    expect(result.current.orders).toHaveLength(1);
    expect(result.current.orders[0]).toEqual({
      id: 1,
      type: "NORMAL",
      status: "PENDING",
    });
  });

  it("should add VIP order before normal orders but after VIP orders", () => {
    const { result } = renderHook(() => useOrderSystem());

    act(() => {
      result.current.addOrder("NORMAL");
      result.current.addOrder("VIP");
      result.current.addOrder("NORMAL");
      result.current.addOrder("VIP");
    });

    const pendingOrders = result.current.orders.filter(
      (order) => order.status === "PENDING"
    );
    expect(pendingOrders).toHaveLength(4);
    expect(pendingOrders[0].type).toBe("VIP");
    expect(pendingOrders[1].type).toBe("VIP");
    expect(pendingOrders[2].type).toBe("NORMAL");
    expect(pendingOrders[3].type).toBe("NORMAL");
  });

  it("should process order with bot", async () => {
    const { result } = renderHook(() => useOrderSystem());

    act(() => {
      result.current.addOrder("NORMAL");
      result.current.addBot();
    });

    // Wait for bot to pick up order
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(result.current.bots[0].isIdle).toBe(false);
    expect(result.current.bots[0].currentOrderId).toBe(1);

    // Wait for order to complete
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000);
    });

    expect(result.current.orders[0].status).toBe("COMPLETE");
    expect(result.current.bots[0].isIdle).toBe(true);
  });

  it("should remove bot and return order to pending", () => {
    const { result } = renderHook(() => useOrderSystem());

    act(() => {
      result.current.addOrder("NORMAL");
      result.current.addBot();
    });

    // Wait for bot to pick up order
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      result.current.removeBot();
    });

    expect(result.current.bots).toHaveLength(0);
    expect(result.current.orders[0].status).toBe("PENDING");
    expect(result.current.orders[0].botId).toBeUndefined();
  });
});
