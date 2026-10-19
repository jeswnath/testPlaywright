# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: petstore-broken.spec.ts >> PetStore E2E Order Flow - Self Healing Demo
- Location: tests/petstore-broken.spec.ts:3:5

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#WelcomeContent')
Expected substring: "Welcome Perf!"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" locator('#WelcomeContent') with timeout 5000ms
  - waiting for locator('#WelcomeContent')

```

```yaml
- link:
  - /url: /actions/Catalog.action
  - img
- link:
  - /url: /actions/Cart.action?viewCart=
  - img
- img
- link "Sign In":
  - /url: /actions/Account.action?signonForm=
- img
- link "?":
  - /url: ../help.html
- textbox
- button "Search"
- link:
  - /url: /actions/Catalog.action?viewCategory=&categoryId=FISH
  - img
- img
- link:
  - /url: /actions/Catalog.action?viewCategory=&categoryId=DOGS
  - img
- img
- link:
  - /url: /actions/Catalog.action?viewCategory=&categoryId=REPTILES
  - img
- img
- link:
  - /url: /actions/Catalog.action?viewCategory=&categoryId=CATS
  - img
- img
- link:
  - /url: /actions/Catalog.action?viewCategory=&categoryId=BIRDS
  - img
- list:
  - listitem: Invalid username or password. Signon failed.
- paragraph: Please enter your username and password.
- paragraph:
  - text: "Username:"
  - textbox
  - text: "Password:"
  - textbox: j2ee
- button "Login"
- text: Need a user name and password?
- link "Register Now!":
  - /url: /actions/Account.action?newAccountForm=
- text: Elevate you load-testing with
- link "OctoPerf":
  - /url: https://octoperf.com
- text: "! Hosted by"
- link "https://octoperf.com":
  - /url: https://octoperf.com
- text: "| Powered by"
- link "www.mybatis.org":
  - /url: https://mybatis.org/
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('PetStore E2E Order Flow - Self Healing Demo', async ({ page }) => {
  4  |   // 1. Launch - https://petstore.octoperf.com/actions/Catalog.action
  5  |   await page.goto('https://petstore.octoperf.com/actions/Catalog.action');
  6  |   await expect(page).toHaveTitle(/JPetStore Demo/);
  7  | 
  8  |   // 2. Click Sign in (BRITTLE OLD LOCATOR - SIMULATING UI DRIFT)
  9  |   await page.getByRole('link', { name: 'Sign In' }).click();
  10 |   await page.locator('input[name="username"]').fill('perf_1231');
  11 |   const passwordField = page.locator('input[name="password"]');
  12 |   await passwordField.clear();
  13 |   await passwordField.fill('Pass');
  14 |   await page.locator('input[name="signon"]').click();
  15 | 
  16 |   // Verify successful sign-in
> 17 |   await expect(page.locator('#WelcomeContent')).toContainText('Welcome Perf!');
     |                                                 ^ Error: expect(locator).toContainText(expected) failed
  18 | 
  19 |   // 3. Click FISH
  20 |   await page.locator('#QuickLinks a[href*="categoryId=FISH"]').click();
  21 |   await expect(page.getByRole('heading', { name: 'Fish' })).toBeVisible();
  22 | 
  23 |   // 4. Click FI-SW-01
  24 |   await page.getByRole('link', { name: 'FI-SW-01' }).click();
  25 |   await expect(page.getByRole('heading', { name: 'Angelfish' })).toBeVisible();
  26 | 
  27 |   // 5. Click Add to cart
  28 |   await page.getByRole('link', { name: 'Add to Cart' }).first().click();
  29 |   await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
  30 | 
  31 |   // 6. Click Proceed to Checkout
  32 |   await page.getByRole('link', { name: 'Proceed to Checkout' }).click();
  33 |   await expect(page.locator('#Catalog')).toContainText('Payment Details');
  34 | 
  35 |   // 7. Click Continue
  36 |   await page.locator('input[name="newOrder"]').click();
  37 |   await expect(page.locator('#Catalog')).toContainText('Please confirm the information below');
  38 | 
  39 |   // 8. Click Confirm
  40 |   await page.getByRole('link', { name: 'Confirm' }).click();
  41 |   await expect(page.locator('#Catalog')).toContainText(/Order #\d+/);
  42 | 
  43 |   // 9. Click Sign out
  44 |   await page.getByRole('link', { name: 'Sign Out' }).click();
  45 |   await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
  46 | });
  47 | 
```