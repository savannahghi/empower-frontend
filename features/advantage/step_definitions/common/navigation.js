const { When } = require('@cucumber/cucumber');
const { By } = require('selenium-webdriver');

When(/^I click the "([^"]*)" button$/, async function(buttonText) {
    const button = await this.driver.findElement(By.linkText(buttonText));
    button.click();
});
