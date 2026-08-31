import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../@core/auth/services/authentication.service';
import { UIRouterModule } from '@uirouter/angular';
import { SkikaFormModule } from '../../../shared/sil-form/sil-form.module';
import { NgPipesModule } from 'ngx-pipes';
import {
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbUserModule,
    NbTabsetModule,
    NbListModule,
    NbThemeModule,
    NbSpinnerModule,
    NbToastrModule,
    NbAlertModule,
    NbAccordionModule,
    NbTooltipModule,
    NbTagModule,
} from '@nebular/theme';
import { SilDatatableModule } from '../../../shared/sil-datatable/sil-datatable.module';
import { FeaturesModule } from '../../features.module';
import { SilDatatableService } from '../../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { SkikaLayoutModule } from '../../../shared/sil-layout/sil-layout.module';
import { ThemeModule } from '../../../@theme/theme.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { StatusColorPipe } from '../../../@theme/pipes';
import { ENROLLMENT_STATES } from './enrollment.states';
import { EnrollmentListComponent } from './enrollment-list/enrollment-list.component';
import { EnrollmentBannerComponent } from './enrollment-banner/enrollment-banner.component';
import { NgxTranslateModule } from 'app/shared/translate/translate.module';
import { BiometricsEnrollmentComponent } from './biometrics-enrollment/biometrics-enrollment.component';
import { VariantPipe } from 'app/@theme/pipes/variant/variant.pipe';
import { FeatureFlagPipe } from 'app/@theme/pipes/feature-flag/feature-flag.pipe';
import { NgOtpInputModule } from 'ng-otp-input';
import { VariantDisplayPipe } from 'app/@theme/pipes/variant-display/variant-display.pipe';
import { BiometricsAuthenticationComponent } from './biometrics-authentication/biometrics-authentication.component';

@NgModule({
    imports: [
        UIRouterModule.forChild({ states: ENROLLMENT_STATES }),
        CommonModule,
        NbInputModule,
        NbCardModule,
        NbButtonModule,
        NbActionsModule,
        NbUserModule,
        NbCheckboxModule,
        NbRadioModule,
        NbDatepickerModule,
        NbSelectModule,
        NbIconModule,
        NbListModule,
        NbThemeModule,
        NbTabsetModule,
        NbSpinnerModule,
        NbToastrModule,
        NbAlertModule,
        NbAccordionModule,
        NbTagModule,
        NbTooltipModule,
        NgPipesModule,
        NgxSkeletonLoaderModule,
        NgxTranslateModule,
        FeaturesModule,
        SkikaFormModule,
        SilDatatableModule,
        SkikaLayoutModule,
        ThemeModule,
        SweetAlert2Module,
        StatusColorPipe,
        VariantPipe,
        FeatureFlagPipe,
        NgOtpInputModule,
        VariantDisplayPipe,
    ],
    declarations: [
        EnrollmentListComponent,
        EnrollmentBannerComponent,
        BiometricsEnrollmentComponent,
        BiometricsAuthenticationComponent,
    ],
    providers: [SilStoresService, SilDatatableService, AuthenticationService],
})
export class EnrollmentModule {}
