import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';

Given('I am on the login page', async ({ loginPage }) => {
    await loginPage.goto();
});

When('I login with valid credentials', async ({ loginPage }) => {
    await loginPage.login('standard_user', 'secret_sauce');
});

When('I login with locked out user credentials', async ({ loginPage }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');
});

Then('I should see the inventory page', async ({ page }) => {
    await expect(page).toHaveURL(/.*inventory.html/);
});

Then('I should see a locked out error message', async ({ loginPage }) => {
    await expect(await loginPage.getErrorMessage()).toBeVisible();
    await expect(await loginPage.getErrorMessage()).toContainText('Epic sadface: Sorry, this user has been locked out.');
});
