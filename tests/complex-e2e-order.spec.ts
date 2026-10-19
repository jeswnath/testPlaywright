import { test, expect } from '@playwright/test';

test('Complex E2E PetStore Checkout Transaction Flow', async ({ page }) => {
  // --------------------------------------------------------------------------
  // STEP 1: Launch Catalog & Validate Session Readiness
  // --------------------------------------------------------------------------
  await page.goto('https://petstore.octoperf.com/actions/Catalog.action');
  await expect(page).toHaveTitle(/JPetStore Demo/);

  // --------------------------------------------------------------------------
  // STEP 2: Authentication & Account Verification
  // --------------------------------------------------------------------------
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.locator('input[name="username"]').fill('perf_1');
  const passwordField = page.locator('input[name="password"]');
  await passwordField.clear();
  await passwordField.fill('Pass');
  await page.locator('input[name="signon"]').click();
  await expect(page.getByRole('link', { name: 'Sign Out' })).toBeVisible();

  // --------------------------------------------------------------------------
  // STEP 3: Department Navigation (Category: FISH)
  // --------------------------------------------------------------------------
  await page.locator('#QuickLinks a[href*="categoryId=FISH"]').click();
  await expect(page.getByRole('heading', { name: 'Fish' })).toBeVisible();

  // --------------------------------------------------------------------------
  // STEP 4: Product Selection & Pricing Audit (FI-SW-01 Angelfish)
  // --------------------------------------------------------------------------
  await page.getByRole('link', { name: 'FI-SW-01' }).click();
  await expect(page.getByRole('heading', { name: 'Angelfish' })).toBeVisible();

  // --------------------------------------------------------------------------
  // STEP 5: Cart Ingestion & Subtotal Validation
  // --------------------------------------------------------------------------
  await page.getByRole('link', { name: 'Add to Cart' }).first().click();
  await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
  await expect(page.locator('#Catalog')).toContainText('Sub Total: $16.50');

  // --------------------------------------------------------------------------
  // STEP 6: Checkout Transition (COMPLEX FAILURE IN ORDER TRANSACTION)
  // ❌ SIMULATING REAL-WORLD ACCESSIBILITY/ROLE DRIFT:
  // Stylized as a button in CSS, but semantically rendered as an anchor link
  // --------------------------------------------------------------------------
  await page.getByRole('link', { name: 'Proceed to Checkout' }).click({ timeout: 5000 });
  await expect(page.locator('#Catalog')).toContainText('Payment Details');

  // --------------------------------------------------------------------------
  // STEP 7: Payment & Billing Address Submission
  // --------------------------------------------------------------------------
  await page.locator('input[name="newOrder"]').click();
  await expect(page.locator('#Catalog')).toContainText('Please confirm the information below');

  // --------------------------------------------------------------------------
  // STEP 8: Final Order Placement & Invoice Verification
  // --------------------------------------------------------------------------
  await page.getByRole('link', { name: 'Confirm' }).click();
  await expect(page.locator('#Catalog')).toContainText(/Order #\d+/);
  await expect(page.locator('#Catalog')).toContainText('Total: $16.50');

  // --------------------------------------------------------------------------
  // STEP 9: Clean Session Tear-Down
  // --------------------------------------------------------------------------
  await page.getByRole('link', { name: 'Sign Out' }).click();
  await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
});

