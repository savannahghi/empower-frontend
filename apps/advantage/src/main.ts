/**
 * @license
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { UIView } from '@uirouter/angular';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production === 'true') {
    enableProdMode();
}

bootstrapApplication(UIView, {
    providers: [importProvidersFrom(AppModule)],
}).catch(err => console.error(err));
