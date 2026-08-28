// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    const configuration = {
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-esbuild'),
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage-istanbul-reporter'),
            require('karma-coverage'),
            require('karma-spec-reporter'),
            require('@angular-devkit/build-angular/plugins/karma'),
        ],
        client: {
            clearContext: false, // leave Jasmine Spec Runner output visible in browser
        },
        preprocessors: {
            // Add esbuild to your preprocessors
            'test/**/*.test.js': ['esbuild'],
        },
        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, 'coverage'),
            subdir: '.',
            reports: ['html', 'lcovonly', 'text', 'text-summary'],
            thresholds: {
                global: {
                    statements: 100,
                    branches: 100,
                    functions: 100,
                    lines: 100,
                },
            },
        },
        angularCli: {
            environment: 'dev',
        },
        reporters: ['spec', 'kjhtml', 'coverage-istanbul'],
        specReporter: {
            maxLogLines: 5,
            suppressSummary: false,
            suppressErrorSummary: false,
            suppressPassed: false,
            suppressFailed: false,
            suppressSkipped: true,
            showBrowser: false,
            showSpecTiming: false,
            failFast: false,
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeHeadlessCI'],
        customLaunchers: {
            ChromeHeadlessCI: {
                base: 'ChromeHeadless',
                flags: [
                    '--disable-web-security',
                    '--disable-site-isolation-trials',
                    '--disable-gpu',
                    '--headless',
                    '--no-sandbox',
                    '--remote-debugging-port=9222',
                    '--js-flags=--max-old-space-size=8196',
                    '--disable-translate',
                    '--disable-extensions',
                    '--disable-dev-shm-usage',
                ],
            },
        },
        restartOnFileChange: true,
        captureTimeout: 300000,
        browserNoActivityTimeout: 300000,
        browserDisconnectTimeout: 300000,
        browserDisconnectTolerance: 2,
        singleRun: true,
    };

    if (process.env.TRAVIS) {
        configuration.browsers = ['HeadlessChromium'];
    }

    config.set(configuration);
};
