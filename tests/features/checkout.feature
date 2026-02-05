Feature: Checkout Flow
    As a logged-in user
    I want to purchase items
    So that I can receive them

    Scenario: Complete Checkout Flow
        Given I am logged in
        When I add "Sauce Labs Backpack" to the cart
        And I proceed to checkout from the cart
        And I fill in my information with "John", "Doe", "12345"
        And I finish the checkout
        Then I should see the order success message
