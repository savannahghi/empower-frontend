import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
/**
 * Module that creates Translate Module.
 */
@NgModule({
    declarations: [],
    exports: [TranslateModule],
    imports: [
        CommonModule,
        TranslateModule.forRoot({
            fallbackLang: 'en',
            loader: provideTranslateHttpLoader({
                prefix: './assets/i18n/',
                suffix: '.json',
            }),
        }),
    ],
    providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class NgxTranslateModule {}
