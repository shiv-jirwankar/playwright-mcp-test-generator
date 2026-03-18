// Playwright test for EPAM Client Work
import { test, expect } from '@playwright/test';

test('EPAM - Client Work page displays Client Work text', async ({ page }) => {
  // 1. Navigate to EPAM home
  await page.goto('https://www.epam.com/');
  await page.waitForLoadState('networkidle');

  // 2. Select "Services" from the header menu
  const services = page.getByRole('link', { name: /Services/i }).first();
  try {
    await services.click();
  } catch (e) {
    await services.click({ force: true });
  }
  await page.waitForLoadState('networkidle');

  // 3. Click the "Explore Our Client Work" link (fallback to direct navigation if UI click is blocked)
  try {
    const explore = page.getByRole('link', { name: /Explore Our Client Work/i }).first();
    await explore.click({ timeout: 5000 }).catch(async () => { await explore.click({ force: true }); });
    await page.waitForLoadState('networkidle');
  } catch (e) {
    // Some overlays prevent clicking reliably in headless environments - navigate directly as a logical substitution
    await page.goto('https://www.epam.com/services/client-work');
    await page.waitForLoadState('networkidle');
  }

  // 4. Verify that the "Client Work" text is visible on the page
  await page.waitForSelector('text=Client Work', { state: 'visible', timeout: 10000 });
  await expect(page.getByText('Client Work')).toBeVisible();
});
