import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';

Given('I am logged in', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
});

When('I add {string} to the cart', async ({ inventoryPage }, itemName: string) => {
    await inventoryPage.addItemToCart(itemName);
});

When('I proceed to checkout from the cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goToCart();
    await cartPage.checkout();
});

When('I fill in my information with {string}, {string}, {string}', async ({ checkoutPage }, firstName: string, lastName: string, zip: string) => {
    await checkoutPage.fillInformation(firstName, lastName, zip);
});

When('I finish the checkout', async ({ checkoutPage }) => {
    await checkoutPage.finishCheckout();
});

Then('I should see the order success message', async ({ checkoutPage }) => {
    await expect(await checkoutPage.getOrderSuccessMessage()).toBeVisible();
    await expect(await checkoutPage.getOrderSuccessMessage()).toHaveText('Thank you for your order!');
});
