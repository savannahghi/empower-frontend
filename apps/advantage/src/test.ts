/**
 * @license
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import 'zone.js';
import 'zone.js/testing';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
// eslint-disable-next-line @typescript-eslint/naming-convention
// declare const __karma__: any;
// declare const require: any;

// Prevent Karma from running prematurely.
// __karma__.loaded = function () {};

export function cleanStylesFromDOM(): void {
    const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
    const styles: HTMLCollectionOf<HTMLStyleElement> | [] =
        head.getElementsByTagName('style');

    for (let i: number = 0; i < styles.length; i++) {
        head.removeChild(styles[i]);
    }
}

// Then we find all the tests.
// const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
// context.keys().map(context);
// Finally, start Karma to run the tests.
// __karma__.start();
