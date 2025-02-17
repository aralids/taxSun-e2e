// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
	testDir: "./tests",
	timeout: 45000,
	fullyParallel: false,
	workers: 1,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: "html",
	use: {
		baseURL: "http://localhost:5173/",
		trace: "on-first-retry",
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
				contextOptions: {
					permissions: ["clipboard-read", "clipboard-write"],
				},
			},
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		/*
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
        */
	],
});
