// Generated from: tests\features\login.feature
import { test } from "../../../tests/fixtures.ts";

test.describe('Login', () => {

  test('Successful Login', async ({ Given, When, Then, loginPage, page }) => { 
    await Given('I am on the login page', null, { loginPage }); 
    await When('I login with valid credentials', null, { loginPage }); 
    await Then('I should see the inventory page', null, { page }); 
  });

  test('Locked Out User', async ({ Given, When, Then, loginPage }) => { 
    await Given('I am on the login page', null, { loginPage }); 
    await When('I login with locked out user credentials', null, { loginPage }); 
    await Then('I should see a locked out error message', null, { loginPage }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests\\features\\login.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":6,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the login page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When I login with valid credentials","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then I should see the inventory page","stepMatchArguments":[]}]},
  {"pwTestLine":12,"pickleLine":11,"tags":[],"steps":[{"pwStepLine":13,"gherkinStepLine":12,"keywordType":"Context","textWithKeyword":"Given I am on the login page","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"When I login with locked out user credentials","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"Then I should see a locked out error message","stepMatchArguments":[]}]},
]; // bdd-data-end