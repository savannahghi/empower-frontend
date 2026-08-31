import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UIRouterModule } from '@uirouter/angular';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { FeatureFlagPipe } from '../../@theme/pipes/feature-flag/feature-flag.pipe';
import { SkikaAuthRoutingModule } from './auth-routing.module';
import { NgOtpInputModule } from 'ng-otp-input';
import {
    NbAlertModule,
    NbButtonModule,
    NbCheckboxModule,
    NbInputModule,
    NbIconModule,
    NbFormFieldModule,
    NbRadioModule,
    NbCardModule,
    NbSpinnerModule,
    NbLayoutModule,
    NbProgressBarModule,
    NbSelectModule,
    NbStepperModule,
    NbUserModule,
} from '@nebular/theme';

import { SkikaFormModule } from '../../shared/sil-form/sil-form.module';
import { SkikaLayoutModule } from '../../shared/sil-layout/sil-layout.module';

import { SkikaAuthComponent } from './components/skika-auth/skika-auth.component';
import { SkikaLoginComponent } from './components/login/login.component';
import { SkikaRegisterComponent } from './components/register/register.component';
import { CompleteAuthComponent } from './components/complete/complete.component';
import { WorkstationComponent } from './components/workstation/workstation.component';
import { SilLogoutComponent } from './components/logout/logout.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';

import { AuthProvider } from './services/auth.service';
import { Authorization } from './services/authorization.service';
import { DataLayerUtils } from './services/datalayer.utils.service';
import { HomePageService } from './services/home-page.service';
import { CompleteService } from './services/login.service';
import { Oauth2Service } from './services/oauth2.service';
import { SessionService } from './services/session.service';
import { Setup } from './services/setup.service';
import { NgxTranslateModule } from '../../shared/translate/translate.module';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ThemeModule } from '../../@theme/theme.module';
import { VariantDisplayPipe } from '../../@theme/pipes/variant-display/variant-display.pipe';
import { AppsComponent } from './components/apps/apps.component';
import { VariantPipe } from '../../@theme/pipes/variant/variant.pipe';
import { NbAuthModule } from '@nebular/auth';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SilErrorViewComponent } from '../../shared/sil-error-view/sil-error-view/sil-error-view.component';
import { WINDOW } from '../../features/services/window.service';
import { MFAComponent } from './components/mfa/mfa.component';
import { EmpowerWelcomeComponent } from './components/welcome/empower-welcome.component';
import { OnboardingWrapperComponent } from './components/onboarding-wrapper/onboarding-wrapper.component';
@NgModule({
    declarations: [
        SkikaAuthComponent,
        SkikaLoginComponent,
        SignUpComponent,
        SkikaRegisterComponent,
        CompleteAuthComponent,
        WorkstationComponent,
        SilLogoutComponent,
        ErrorPageComponent,
        AppsComponent,
        ResetPasswordComponent,
        MFAComponent,
        EmpowerWelcomeComponent,
        OnboardingWrapperComponent,
    ],
    imports: [
        NbAuthModule,
        UIRouterModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        NbAlertModule,
        NbInputModule,
        NbButtonModule,
        NbIconModule,
        NbFormFieldModule,
        NbCheckboxModule,
        NbRadioModule,
        NbCardModule,
        NbLayoutModule,
        NbSpinnerModule,
        NbUserModule,
        NbProgressBarModule,
        NbSelectModule,
        NbStepperModule,
        SkikaAuthRoutingModule,
        NbStepperModule,
        SkikaFormModule,
        SkikaLayoutModule,
        NgxTranslateModule,
        ThemeModule,
        FeatureFlagPipe,
        VariantDisplayPipe,
        VariantPipe,
        SilErrorViewComponent,
        NgOtpInputModule,
    ],
    providers: [
        AuthProvider,
        Authorization,
        DataLayerUtils,
        HomePageService,
        CompleteService,
        Oauth2Service,
        SessionService,
        Setup,
        CompleteService,
        { provide: WINDOW, useValue: window },
        provideHttpClient(withInterceptorsFromDi()),
    ],
    exports: [OnboardingWrapperComponent],
})
export class SkikaAuthModule {}
