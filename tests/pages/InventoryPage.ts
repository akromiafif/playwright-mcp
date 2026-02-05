import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly cartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartLink = page.locator('.shopping_cart_link');
    }

    async addItemToCart(itemName: string) {
        // Ideally use a more robust selector like data-test if available, but text is good for BDD readability
        // Using a refined locator strategy to find the specific item's add button
        // Assuming structure: .inventory_item -> .inventory_item_description -> .pricebar -> button
        // Or simpler: getByText(itemName) .. parent .. getByRole('button', {name: 'Add to cart'})
        // For SauceDemo, IDs are like add-to-cart-sauce-labs-backpack
        const idFriendlyName = itemName.toLowerCase().replace(/ /g, '-');
        await this.page.locator(`[data-test="add-to-cart-${idFriendlyName}"]`).click();
    }

    async goToCart() {
        await this.cartLink.click();
    }
}
