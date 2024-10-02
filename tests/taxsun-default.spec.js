const { test, describe, expect, beforeEach } = require("@playwright/test");

test.describe("test landing page and default dataset", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("");
	});

	test("page loads", async ({ page }) => {
		await expect(page).toHaveTitle("taxSun Metagenome Visualization");
		await expect(page.locator(".wedge")).toHaveCount(433);
	});

	test("responds to plot hover", async ({ page }) => {
		await page.locator('text:has-text("Helo")').hover();
		const hoverInfoCard = page.locator('.card:has-text("Hovering over:")');
		await expect(hoverInfoCard).toContainText("Helo");
		await expect(hoverInfoCard).toContainText("Rank: order");
	});

	test("responds to plot click", async ({ page }) => {
		await page.locator('text:has-text("Helo")').click();
		const layerInfoCard = page.locator('.card:has-text("Current root:")');
		await expect(layerInfoCard).toContainText("Helo");
		await expect(layerInfoCard).toContainText("Rank: order");
	});

	test("fetches unknown ID", async ({ page }) => {
		await page.locator('text:has-text("Tri")').click();
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
		await page.locator('text:has-text("Dikarya")').click();
		await page.locator('p:has-text("Eukaryota")').click();
		const layerInfoCard = page.locator('.card:has-text("Current root:")');
		await expect(layerInfoCard).toContainText("Eukaryota");
		await expect(layerInfoCard).toContainText("Rank: superkingdom");
	});

	test("collapses plot", async ({ page }) => {
		await page.locator("#collapse").click();
		await expect(page.locator(".wedge")).toHaveCount(224);
	});

	test("eValue options disabled", async ({ page }) => {
		await expect(page.locator("#eValueApplied")).not.toBeEnabled();
		await expect(page.locator("[value='1.9e-28']")).not.toBeEnabled();
	});

	test("switches to unaltered", async ({ page }) => {
		await expect(page.locator('text:has-text("Helo")')).toBeVisible();
		await page.locator("#unaltered").click();
		await expect(page.locator('text:has-text("Helo")')).not.toBeVisible();
	});

	test("switches to marriedTaxaI", async ({ page }) => {
		await expect(page.locator('[fill="url(#marriage-pattern-1)"]')).toHaveCount(
			0
		);
		await page.locator("#marriedTaxaI").click();
		await expect(page.locator('[fill="url(#marriage-pattern-1)"]')).toHaveCount(
			12
		);
	});

	test("switches to marriedTaxaII", async ({ page }) => {
		await expect(page.locator('[fill="url(#marriage-pattern-1)"]')).toHaveCount(
			0
		);
		await page.locator("#marriedTaxaII").click();
		await expect(page.locator('[fill="url(#marriage-pattern-1)"]')).toHaveCount(
			13
		);
	});

	test("switches to allEqual", async ({ page }) => {
		await page.locator("#unaltered").click();
		await expect(page.locator('text:has-text("Helo")')).not.toBeVisible();
		await page.locator("#allEqual").click();
		await expect(page.locator('text:has-text("Helo")')).toBeVisible();
	});

	test("downloads SVG", async ({ page }) => {
		const downloadPromise = page.waitForEvent("download");
		await page.locator('button:has-text("SVG")').click();
		const download = await downloadPromise;

		await expect(download.suggestedFilename()).toBe(
			"default_root root_collapse-false_eValue-false_allEqual.svg"
		);
	});

	test("displays context menu", async ({ page }) => {
		await page.locator('text:has-text("Sor")').click({ button: "right" });
		await expect(
			page.locator('button:has-text("Copy unspecified")')
		).toBeVisible();
		await expect(page.locator('button:has-text("Copy all")')).toBeVisible();
		await expect(
			page.locator('button:has-text("Download unspecified")')
		).toBeVisible();
		await expect(page.locator('button:has-text("Download all")')).toBeVisible();
	});

	test("copies unspecified seq", async ({ page, browserName }) => {
		// Only perform test for chromium as other browsers don't yet support
		// navigator.clipboard.readText() and hence their copy behaviors cannot
		// be automatically tested.
		if (browserName === "chromium") {
			await page.locator('text:has-text("Sor")').click({ button: "right" });
			await page.locator('button:has-text("Copy unspecified")').click();

			let clipboardText = await page.evaluate("navigator.clipboard.readText()");
			expect(clipboardText).toContain(
				"FUN_06715 FUN_06426 FUN_06529 FUN_06545 FUN_06577 FUN_06637 FUN_03290 FUN_03951 FUN_08101 FUN_08100 FUN_09125 FUN_06716 FUN_03952 FUN_00868 FUN_02244 FUN_04012 FUN_03417 FUN_02254 FUN_01367"
			);
		}
	});

	test("copies all seq", async ({ page, browserName }) => {
		// Only perform test for chromium as other browsers don't yet support
		// navigator.clipboard.readText() and hence their copy behaviors cannot
		// be automatically tested.
		if (browserName === "chromium") {
			await page.locator('text:has-text("Sor")').click({ button: "right" });
			await page.locator('button:has-text("Copy all")').click();

			let clipboardText = await page.evaluate("navigator.clipboard.readText()");
			expect(clipboardText).toContain(
				"FUN_06715 FUN_06426 FUN_06529 FUN_06545 FUN_06577 FUN_06637 FUN_03290 FUN_03951 FUN_08101 FUN_08100 FUN_09125 FUN_06716 FUN_03952 FUN_00868 FUN_02244 FUN_04012 FUN_03417 FUN_02254 FUN_01367 FUN_04011 FUN_04242 FUN_09129 FUN_09127 FUN_07867 FUN_09126 FUN_09746 FUN_09175 FUN_09461 FUN_09747 FUN_09748 FUN_04010 FUN_01174 FUN_08202 FUN_08203 FUN_05143 FUN_08698 FUN_08012 FUN_01173 FUN_09311 FUN_01572 FUN_07846 FUN_09416 FUN_06628 FUN_09560 FUN_03263"
			);
		}
	});
});
