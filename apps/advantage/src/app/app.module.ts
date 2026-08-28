/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {
    BrowserModule,
    provideClientHydration,
    withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { UIRouterModule } from '@uirouter/angular';
import {
    HTTP_INTERCEPTORS,
    provideHttpClient,
    withFetch,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AuthenticationService } from './@core/auth/services/authentication.service';
import { AppConfigService } from './app-config.service';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Authorization } from './@core/auth/services/authorization.service';
import { DataLayerUtils } from './@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from './@core/auth/services/oauth2.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import {
    NbChatModule,
    NbButtonModule,
    NbIconModule,
    NbCardModule,
    NbDatepickerModule,
    NbDialogModule,
    NbMenuModule,
    NbSidebarModule,
    NbTimepickerModule,
    NbToastrModule,
    NbWindowModule,
} from '@nebular/theme';
import { NbMomentDateModule } from '@nebular/moment';
import { AuthInterceptor } from './shared/sil-http-services/auth-interceptor';
import { APP_STATES } from './app.states';
import { routerConfigFn } from './router.config';
import { AngularFireModule } from '@angular/fire/compat';
import {
    AngularFireAnalyticsModule,
    UserTrackingService,
} from '@angular/fire/compat/analytics';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ShepherdService } from 'angular-shepherd';
import { SilGraphQlModule } from './shared/sil-graphql/sil-graphql.module';
import { environment } from '../environments/environment';
import { NgxTranslateModule } from './shared/translate/translate.module';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { SessionService } from './@core/auth/services/session.service';
import { SkikaAuthModule } from './@core/auth/auth.module';
import { InitializeFlagsService } from './@core/utils/initialize-flags.service';
import { StepperService } from './shared/component-services/stepper.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RedirectService } from './@core/auth/services/redirect.service';
import { WINDOW } from './features/services/window.service';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MarkdownModule } from 'ngx-markdown';
import { UIView } from '@uirouter/angular';

function initializeKeycloak(
    keycloak: KeycloakService,
    intitializeFlagService: InitializeFlagsService
) {
    return async () => {
        await intitializeFlagService.loadFlags();

        // Check for the flag. Keycloak init only happens if this is true.
        const isKeycloakEnabled = intitializeFlagService.getForcedValue(
            'prov_authenticationSetKeyCloakToTrue'
        );

        // Check keycloak has been enabled via feature flag
        if (isKeycloakEnabled) {
            return keycloak.init({
                config: {
                    url: environment.keycloak.authURL,
                    realm: environment.keycloak.realm,
                    clientId: environment.keycloak.clientId,
                },
                initOptions: {
                    onLoad: 'check-sso',
                    pkceMethod: environment.keycloak.pkceMethod || 'S256',
                    checkLoginIframe: false,
                },
                enableBearerInterceptor: true,
                bearerExcludedUrls: ['/assets', '/clients/public'],
            });
        } else {
            // If keycloak is disabled, skip initialization immediately
            return Promise.resolve(true);
        }
    };
}

@NgModule({
    declarations: [AppComponent],
    // Removed bootstrap array as UIView is a standalone component
    imports: [
        UIRouterModule.forRoot({
            states: APP_STATES,
            useHash: false,
            initial: { state: 'auth.login' },
            config: routerConfigFn,
            otherwise: { state: 'auth.error', params: { error: '404' } },
        }),
        UIView,
        BrowserModule,
        BrowserAnimationsModule,
        KeycloakAngularModule,
        CommonModule,
        ModalModule.forRoot(),
        ThemeModule.forRoot(),
        SkikaAuthModule,
        NbCardModule,
        NbButtonModule,
        NbIconModule,
        NbSidebarModule.forRoot(),
        NbMenuModule.forRoot(),
        NbDatepickerModule.forRoot(),
        NbMomentDateModule,
        NbDialogModule.forRoot(),
        NbWindowModule.forRoot(),
        NbToastrModule.forRoot({
            /** prevents multiple re-rendering of toasts of the same title, message and status */
            preventDuplicates: true,
        }),
        NbChatModule.forRoot({
            messageGoogleMapKey: environment.messageGoogleMapKey,
        }),
        NbTimepickerModule.forRoot(),
        CoreModule.forRoot(),
        NgIdleKeepaliveModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAnalyticsModule,
        SweetAlert2Module.forRoot(),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production === 'true',
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000',
        }),
        SilGraphQlModule,
        NgxSkeletonLoaderModule,
        NgxTranslateModule,
        MarkdownModule.forRoot(),
    ],
    providers: [
        InitializeFlagsService,
        AppConfigService,
        Authorization,
        DataLayerUtils,
        Oauth2Service,
        CurrencyPipe,
        UserTrackingService,
        AuthenticationService,
        SessionService,
        KeycloakService,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [KeycloakService, InitializeFlagsService],
        },
        provideAnimations(),
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    prefix: 'p',
                    darkModeSelector: '.dark-theme',
                },
            },
            ripple: true,
        }),
        provideCharts(withDefaultRegisterables()),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: WINDOW, useValue: window },
        ShepherdService,
        SsrCookieService,
        StepperService,
        RedirectService,
        provideClientHydration(
            withHttpTransferCacheOptions({
                includePostRequests: true,
            })
        ),
        provideHttpClient(withFetch()),
        provideHttpClient(withInterceptorsFromDi()),
    ],
})
export class AppModule {}
