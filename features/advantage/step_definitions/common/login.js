const assert = require('assert');
const {
    Given,
    Then,
} = require('@cucumber/cucumber');
const { By, until } = require('selenium-webdriver');

Given('I am on the Advantage login page', async function () {
    await this.driver.get(`${this.serverURL}/auth/login`);
});

Then(/I enter "([^"]*)" login credentials and submit$/,
    async function (credzType) {
        const email = this.admin.email;
        let password;
        if (credzType === 'correct') {
            password = this.admin.password;
        } else {
            password = 'this is a wrong password!';
        }

        const emailField = this.driver.findElement(By.id('id_email'));
        await this.driver
            .actions()
            .sendKeys(emailField, email)
            .perform();

        const passwordField = this.driver.findElement(By.id('id_password'));
        await this.driver
            .actions()
            .sendKeys(passwordField, password)
            .perform();

        this.driver.findElement(By.id('id_submit')).click();
    }
);

Then('I should see the Advantage home page', async function() {
    await this.driver.wait(
        until.urlIs(`${this.serverURL}/advantage/home`)
    );
    assert.equal(await this.driver.getTitle(), 'SLADE360 Advantage');

    const welcomeEl = await this.driver
        .wait(until.elementLocated(By.xpath('//ui-view/home-page/div[1]/span')));
    assert.equal(
        await welcomeEl.getText(),
        `Hey ${this.admin.first_name}, welcome`,
    );
});

Then('I should see a login failure error', async function() {
    const alertEl = await this.driver
        .wait(until.elementLocated(By.xpath('//p[@class="alert-danger"]')));
    assert.equal(
        await alertEl.getText(),
        'The email and password combination is invalid or the user is inactive',
    );
});
