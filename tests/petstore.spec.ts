import { test, expect } from '@playwright/test';

test('PetStore E2E Order Flow', async ({ page }) => {
  // 1. Launch - https://petstore.octoperf.com/actions/Catalog.action
  await page.goto('https://petstore.octoperf.com/actions/Catalog.action');
  await expect(page).toHaveTitle(/JPetStore Demo/);

  // 2. Click Sign in - enter Username = perf_1, password = Pass and click Login
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.locator('input[name="username"]').fill('perf_1');
  const passwordField = page.locator('input[name="password"]');
  await passwordField.clear();
  await passwordField.fill('Pass');
  await page.locator('input[name="signon"]').click();

  // Verify successful sign-in
  await expect(page.getByRole('link', { name: 'Sign Out' })).toBeVisible();

  // 3. Click FISH
  await page.locator('#QuickLinks a[href*="categoryId=FISH"]').click();
  await expect(page.getByRole('heading', { name: 'Fish' })).toBeVisible();

  // 4. Click FI-SW-01
  await page.getByRole('link', { name: 'FI-SW-01' }).click();
  await expect(page.getByRole('heading', { name: 'Angelfish' })).toBeVisible();

  // 5. Click Add to cart
  await page.getByRole('link', { name: 'Add to Cart' }).first().click();
  await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();

  // 6. Click Proceed to Checkout
  await page.getByRole('link', { name: 'Proceed to Checkout' }).click();
  await expect(page.locator('#Catalog')).toContainText('Payment Details');

  // 7. Click Continue
  await page.locator('input[name="newOrder"]').click();
  await expect(page.locator('#Catalog')).toContainText('Please confirm the information below');

  // 8. Click Confirm
  await page.getByRole('link', { name: 'Confirm' }).click();
  await expect(page.locator('#Catalog')).toContainText(/Order #\d+/);

  // 9. Click Sign out
  await page.getByRole('link', { name: 'Sign Out' }).click();
  await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
});

