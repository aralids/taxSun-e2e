const { test, describe, expect, beforeEach } = require("@playwright/test");
import * as path from "path";

test.describe("test Homo Sapiens dataset upload", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("");
		const fileChooserPromise = page.waitForEvent("filechooser");
		await page.getByText("TSV").click();
		const fileChooser = await fileChooserPromise;
		const awaiter = await fileChooser.setFiles(
			"C:/Users/PC/Desktop/taxSun/homsa/homsa/taxsun.tsv"
		);
		await expect(page.locator("span:has-text('check')")).toBeVisible({
			timeout: 45000,
		});
	});

	test("successful file upload", async ({ page }) => {
		await expect(page.locator("span:has-text('check')")).toBeVisible({
			timeout: 45000,
		});
	});

	test("responds to plot hover", async ({ page }) => {
		await page.locator('text:has-text("Bact")').hover();
		const hoverInfoCard = page.locator('.card:has-text("Hovering over:")');
		await expect(hoverInfoCard).toContainText("Bacteria");
		await expect(hoverInfoCard).toContainText("Rank: superkingdom");
	});

	test("responds to plot click", async ({ page }) => {
		await page.locator('text:has-text("Bact")').click();
		const layerInfoCard = page.locator('.card:has-text("Current root:")');
		await expect(layerInfoCard).toContainText("Bacteria");
		await expect(layerInfoCard).toContainText("Rank: superkingdom");
	});

	test("fetches unknown ID", async ({ page }) => {
		await page.locator('text:has-text("Betap")').click();
		const fetchIDButton = page
			.locator('.card:has-text("Current root:")')
			.getByRole("button");
		const fetchedLink = page
			.locator('.card:has-text("Current root:")')
			.getByRole("link");
		await expect(fetchIDButton).toBeVisible();
		await fetchIDButton.click();
		await expect(fetchedLink).toBeVisible();
		await expect(fetchIDButton).not.toBeVisible();
	});

	test("responds to shortcut click", async ({ page }) => {
		await page.locator('text:has-text("Arth")').click();
		await page.locator('p:has-text("Eukaryota")').click();
		const layerInfoCard = page.locator('.card:has-text("Current root:")');
		await expect(layerInfoCard).toContainText("Eukaryota");
		await expect(layerInfoCard).toContainText("Rank: superkingdom");
	});

	test("collapses plot", async ({ page }) => {
		await page.locator("#collapse").click();
		await expect(page.locator(".wedge")).toHaveCount(1419);
	});

	test("change eValue and then eValueApplied", async ({ page }) => {
		await expect(page.locator(".wedge")).toHaveCount(2900);
		await page.locator("#eValue").fill("0.0001");
		await page.locator("#eValue").press("Enter");
		await page.locator("#eValueApplied").click();
		await expect(page.locator(".wedge")).toHaveCount(1117);
	});

	test("change eValueApplied and then eValue", async ({ page }) => {
		await expect(page.locator(".wedge")).toHaveCount(2900);
		await page.locator("#eValueApplied").click();
		await expect(page.locator(".wedge")).toHaveCount(2590);
		await page.locator("#eValue").fill("0.0001");
		await page.locator("#eValue").press("Enter");
		await expect(page.locator(".wedge")).toHaveCount(1117);
	});

	test("switches to unaltered", async ({ page }) => {
		await expect(page.locator('text:has-text("Alpha")')).toBeVisible();
		await page.locator("#unaltered").click();
		await expect(page.locator('text:has-text("Alpha")')).not.toBeVisible();
	});

	test("switches to marriedTaxaI", async ({ page }) => {
		await expect(page.locator('[fill="url(#marriage-pattern-1)"]')).toHaveCount(
			0
		);
		await page.locator("#marriedTaxaI").click();
		await expect(page.locator('[fill="url(#marriage-pattern-1)"]')).toHaveCount(
			22
		);
	});

	test("switches to marriedTaxaII", async ({ page }) => {
		await expect(page.locator('[fill="url(#marriage-pattern-1)"]')).toHaveCount(
			0
		);
		await page.locator("#marriedTaxaII").click();
		await expect(page.locator('[fill="url(#marriage-pattern-1)"]')).toHaveCount(
			25
		);
	});

	test("switches to allEqual", async ({ page }) => {
		await page.locator("#unaltered").click();
		await expect(page.locator('text:has-text("Alpha")')).not.toBeVisible();
		await page.locator("#allEqual").click();
		await expect(page.locator('text:has-text("Alpha")')).toBeVisible();
	});

	test("downloads SVG", async ({ page }) => {
		const downloadPromise = page.waitForEvent("download");
		await page.locator('button:has-text("SVG")').click();
		const download = await downloadPromise;

		await expect(download.suggestedFilename()).toBe(
			"taxsun.tsv_root root_collapse-false_eValue-false_allEqual.svg"
		);
	});
});
