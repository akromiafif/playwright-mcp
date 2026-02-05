// Generated from: tests\features\checkout.feature
import { test } from "../../../tests/fixtures.ts";

test.describe('Checkout Flow', () => {

  test('Complete Checkout Flow', async ({ Given, When, Then, And, cartPage, checkoutPage, inventoryPage, loginPage }) => { 
    await Given('I am logged in', null, { loginPage }); 
    await When('I add "Sauce Labs Backpack" to the cart', null, { inventoryPage }); 
    await And('I proceed to checkout from the cart', null, { cartPage, inventoryPage }); 
    await And('I fill in my information with "John", "Doe", "12345"', null, { checkoutPage }); 
    await And('I finish the checkout', null, { checkoutPage }); 
    await Then('I should see the order success message', null, { checkoutPage }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests\\features\\checkout.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":6,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am logged in","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When I add \"Sauce Labs Backpack\" to the cart","stepMatchArguments":[{"group":{"start":6,"value":"\"Sauce Labs Backpack\"","children":[{"start":7,"value":"Sauce Labs Backpack","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And I proceed to checkout from the cart","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And I fill in my information with \"John\", \"Doe\", \"12345\"","stepMatchArguments":[{"group":{"start":30,"value":"\"John\"","children":[{"start":31,"value":"John","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":38,"value":"\"Doe\"","children":[{"start":39,"value":"Doe","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":45,"value":"\"12345\"","children":[{"start":46,"value":"12345","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"And I finish the checkout","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then I should see the order success message","stepMatchArguments":[]}]},
]; // bdd-data-end