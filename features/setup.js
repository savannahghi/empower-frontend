require('chromedriver');
const {
    After,
    setDefaultTimeout,
    setWorldConstructor,
    World,
} = require('@cucumber/cucumber');
const { Builder, Capabilities } = require('selenium-webdriver');
require('selenium-webdriver/chrome');


class CustomWorld extends World {
    driver = null;
    user = null;
    serverURL = null;

    constructor(options) {
        super(options);

        // setup browser
        const capabilities = Capabilities.chrome();
        capabilities.set('chromeOptions', { 'w3c': false });
        this.driver = new Builder()
            .withCapabilities(capabilities)
            .build();

        // server config
        this.serverURL = 'https://uat-emr.advantage.slade360.com';

        // auth & user options
        this.admin = {
            email: 'jason.wanjohi+4490@savannahinformatics.com',
            password: 'ka@pa55w0rd!',
            first_name: 'Jason',
            last_name: 'Wanjohi',
        };
    }
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(60 * 1000);

After(async function() {
    this.driver.quit();
});
