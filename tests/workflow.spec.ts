import { expect, test } from "@playwright/test";

test("filters, saves, and prices a hobby rental", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Try the hobby/i })).toBeVisible();

  await page.getByRole("button", { name: "Sound", exact: true }).click();
  await expect(page.locator(".kit-card")).toHaveCount(1);
  const mix = page.locator(".kit-card").filter({ hasText: "Mix Your First Set" });
  await mix.getByRole("button", { name: "Save Mix Your First Set" }).click();
  await page.getByRole("button", { name: /Saved 1/ }).click();
  await expect(page.locator(".kit-card")).toHaveCount(1);

  await mix.getByRole("button", { name: /Build a rental/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByLabel("Rental length").fill("7");
  await page.getByLabel(/Ship both ways/).check();
  await page.getByRole("button", { name: /Check availability/ }).click();
  await expect(page.getByText("AVAILABLE · DEMO ONLY")).toBeVisible();
  await expect(page.getByText("$204 due today")).toBeVisible();
  await expect(page.getByText("7+ day discount")).toBeVisible();
});

test("shows search empty state and inventory conflict", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Search kits").fill("no such gear");
  await expect(page.getByRole("heading", { name: "No kits found" })).toBeVisible();
  await page.getByRole("button", { name: "Browse all kits" }).click();

  const clay = page.locator(".kit-card").filter({ hasText: "Clay at the Table" });
  await clay.getByRole("button", { name: /Build a rental/ }).click();
  await page.getByLabel("Rental length").fill("8");
  await page.getByRole("button", { name: /Check availability/ }).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText("Only 7 consecutive days remain");
});

test("has no horizontal overflow on mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only overflow assertion");
  await page.goto("/");
  const pageWidth = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(pageWidth.scroll).toBeLessThanOrEqual(pageWidth.client + 1);
  await page.locator(".kit-card").first().getByRole("button", { name: /Build a rental/ }).click();
  const dialogWidth = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(dialogWidth.scroll).toBeLessThanOrEqual(dialogWidth.client + 1);
});
