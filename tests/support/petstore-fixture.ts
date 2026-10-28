import type { Page } from '@playwright/test';

export const PETSTORE_CATALOG_URL = 'http://petstore.test/actions/Catalog.action';

const renderPage = (content: string, signedIn: boolean): string => `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>JPetStore Demo</title>
    </head>
    <body>
      <header>
        <a href="/actions/Account.action?${signedIn ? 'signoff' : 'signonForm'}=">${signedIn ? 'Sign Out' : 'Sign In'}</a>
      </header>
      <main id="Catalog">${content}</main>
    </body>
  </html>
`;

export async function setupPetStoreFixture(page: Page): Promise<void> {
  let signedIn = false;

  await page.route('http://petstore.test/**', async (route) => {
    const url = new URL(route.request().url());
    const query = url.searchParams;
    let content: string;

    if (query.has('signoff')) {
      signedIn = false;
      content = '<h1>JPetStore Demo</h1><nav id="QuickLinks"><a href="/actions/Catalog.action?viewCategory=&amp;categoryId=FISH">FISH</a></nav>';
    } else if (query.has('signon')) {
      signedIn = true;
      content = '<div id="WelcomeContent">Welcome Perf!</div><nav id="QuickLinks"><a href="/actions/Catalog.action?viewCategory=&amp;categoryId=FISH">FISH</a></nav>';
    } else if (query.has('signonForm')) {
      content = '<h1>Sign In</h1><form action="/actions/Account.action" method="get"><label>Username <input name="username"></label><label>Password <input name="password" type="password"></label><input type="submit" name="signon" value="Login"></form>';
    } else if (query.get('categoryId') === 'FISH') {
      content = '<h2>Fish</h2><a href="/actions/Catalog.action?viewProduct=&amp;productId=FI-SW-01">FI-SW-01</a>';
    } else if (query.has('viewProduct')) {
      content = '<h2>Angelfish</h2><a href="/actions/Cart.action?addItemToCart=&amp;workingItemId=EST-1">Add to Cart</a><a href="/actions/Cart.action?addItemToCart=&amp;workingItemId=EST-2">Add to Cart</a>';
    } else if (query.has('addItemToCart')) {
      content = '<h2>Shopping Cart</h2><p>EST-2 Small Angelfish</p><a href="/actions/Order.action?newOrderForm=">Proceed to Checkout</a>';
    } else if (query.has('newOrderForm')) {
      content = '<h2>Payment Details</h2><form action="/actions/Order.action" method="get"><input type="submit" name="newOrder" value="Continue"></form>';
    } else if (query.has('newOrder')) {
      content = '<p>Please confirm the information below</p><a href="/actions/Order.action?confirmOrder=">Confirm</a>';
    } else if (query.has('confirm')) {
      content = '<p>Please confirm the information below</p><a href="/actions/Order.action?confirmOrder=">Confirm</a>';
    } else if (query.has('confirmOrder')) {
      content = '<p>Order #12345</p><p>Total: $16.50</p>';
    } else {
      content = '<h1>JPetStore Demo</h1><nav id="QuickLinks"><a href="/actions/Catalog.action?viewCategory=&amp;categoryId=FISH">FISH</a></nav>';
    }

    await route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: renderPage(content, signedIn),
    });
  });
}