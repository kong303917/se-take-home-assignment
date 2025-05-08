import { test, expect } from "@playwright/test";

test.describe("Order System", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("should add normal order to pending list", async ({ page }) => {
    await page.click('button:has-text("New Normal Order")');

    const pendingOrders = page.locator('h2:has-text("PENDING") + div > div');
    await expect(pendingOrders).toHaveCount(1);
    await expect(pendingOrders.first()).toContainText("NORMAL Order #1");
  });

  test("should add VIP order before normal orders", async ({ page }) => {
    await page.click('button:has-text("New Normal Order")');
    await page.click('button:has-text("New VIP Order")');

    const pendingOrders = page.locator('h2:has-text("PENDING") + div > div');
    await expect(pendingOrders).toHaveCount(2);
    await expect(pendingOrders.first()).toContainText("VIP Order #2");
    await expect(pendingOrders.nth(1)).toContainText("NORMAL Order #1");
  });

  test("should process order with bot", async ({ page }) => {
    await page.click('button:has-text("New Normal Order")');
    await page.click('button:has-text("+ Bot")');

    // Wait for bot to pick up order
    await page.waitForSelector("text=Processing by Bot #1");

    // Wait for order to complete
    await page.waitForTimeout(10000);

    const completedOrders = page.locator('h2:has-text("COMPLETE") + div > div');
    await expect(completedOrders).toHaveCount(1);
    await expect(completedOrders.first()).toContainText("NORMAL Order #1");
    await expect(completedOrders.first()).toContainText("Completed by Bot #1");
  });

  test("should remove bot and return order to pending", async ({ page }) => {
    await page.click('button:has-text("New Normal Order")');
    await page.click('button:has-text("+ Bot")');

    // Wait for bot to pick up order
    await page.waitForSelector("text=Processing by Bot #1");

    await page.click('button:has-text("- Bot")');

    const pendingOrders = page.locator('h2:has-text("PENDING") + div > div');
    await expect(pendingOrders).toHaveCount(1);
    await expect(pendingOrders.first()).toContainText("NORMAL Order #1");
    await expect(pendingOrders.first()).not.toContainText("Processing by Bot");
  });
});
