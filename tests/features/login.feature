Feature: Login
    As a user
    I want to log in to the application
    So that I can access the inventory

    Scenario: Successful Login
        Given I am on the login page
        When I login with valid credentials
        Then I should see the inventory page

    Scenario: Locked Out User
        Given I am on the login page
        When I login with locked out user credentials
        Then I should see a locked out error message
