/* eslint-disable @typescript-eslint/no-unused-vars */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { StatementComponent } from './account-statements/account-statement.component';
import { PatientAttachmentsComponent } from './patient-attachments/patient-attachments.component';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../@core/auth/services/authentication.service';
import { PatientService } from './patient.service';
import { PATIENT_STATES } from './patients.states';
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
    NbStepperModule,
    NbFormFieldModule,
    NbCalendarModule,
} from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { SilDatatableModule } from '../../../shared/sil-datatable/sil-datatable.module';
import { FeaturesModule } from '../../features.module';
import { SilDatatableService } from '../../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { SkikaLayoutModule } from '../../../shared/sil-layout/sil-layout.module';
import { ThemeModule } from '../../../@theme/theme.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SilDocumentDialogueModule } from '../../../shared/sil-document-dialogue/sil-document-dialogue.module';
import { PatientRegistrationComponent } from './patient-registration/patient-registration.component';
import { NextOfKinListComponent } from './nextOfKin-list/nextOfKin-list.component';
import { PatientDetailsTimelineComponent } from './patient-details/patient-details-timeline/patient-details-timeline.component';
import { SilComboBoxModule } from '../../../shared/sil-combo-box/sil-combo-box.module';
import { FeatureFlagPipe } from '../../../@theme/pipes/feature-flag/feature-flag.pipe';
import { NgxTranslateModule } from '../../../shared/translate/translate.module';
import { StartVisitModule } from '../../../shared/start-visit/start-visit/start-visit.module';
import { SilCurrencyPipe } from '../../../@theme/pipes/currency/currency.pipe';
import { PatientSearchComponent } from './patient-search/patient-search.component';
import { PatientCoverModule } from './patient-cover/patient-cover.module';
import { PatientCoversComponent } from './patient-covers/patient-covers.component';
import { CountryPipe } from '../../../@theme/pipes/country/country.pipe';
import { StepperService } from '../../../shared/component-services/stepper.service';
import { PatientScreeningsComponent } from './patient-screenings/patient-screenings.component';
import { PatientReferralsComponent } from './patient-referrals/patient-referrals.component';
import { PatientFollowUpsComponent } from './patient-follow-ups/patient-follow-ups.component';
import { VariantPipe } from '../../../@theme/pipes/variant/variant.pipe';
import { StatusColorPipe } from '../../../@theme/pipes';
import { ScreeningReportComponent } from '../visits/visit-patient-screening/screening-report/screening-report.component';
import { PatientScreeningReportComponent } from './patient-screening-report/patient-screening-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { PatientPostReferralComponent } from './patient-post-referral/patient-post-referral.component';
import { PatientConsentComponent } from './patient-consent/patient-consent.component';
import { VariantDisplayPipe } from '../../../@theme/pipes/variant-display/variant-display.pipe';
import { PatientTestsComponent } from './patient-tests/patient-tests.component';
import { PatientMedicationRequestComponent } from './patient-medication-request/patient-medication-request.component';
import { DisplayCardComponent } from '../visits/visit-patient-screening/screening-report/display-card/display-card.component';
import { MedicationRequestComponent } from '../visits/visit-patient-screening/medication-request/medication-request.component';
import { PatientMedicationRequestsComponent } from './patient-medication-requests/patient-medication-requests.component';

@NgModule({
    imports: [
        UIRouterModule.forChild({ states: PATIENT_STATES }),
        CommonModule,
        NbInputModule,
        NbCardModule,
        NbButtonModule,
        NbActionsModule,
        NbUserModule,
        NgSelectModule,
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
        NbFormFieldModule,
        NgPipesModule,
        NgxSkeletonLoaderModule,
        FeaturesModule,
        SkikaFormModule,
        SilDatatableModule,
        SkikaLayoutModule,
        ThemeModule,
        SweetAlert2Module,
        SilDocumentDialogueModule,
        NbStepperModule,
        SilComboBoxModule,
        FeatureFlagPipe,
        VariantPipe,
        PatientDetailsTimelineComponent,
        NgxTranslateModule,
        StartVisitModule,
        SilCurrencyPipe,
        CountryPipe,
        StatusColorPipe,
        PatientCoverModule,
        CountryPipe,
        ScreeningReportComponent,
        DisplayCardComponent,
        NbCalendarModule,
        ReactiveFormsModule,
        FormsModule,
        NgOtpInputModule,
        VariantDisplayPipe,
        MedicationRequestComponent,
        DisplayCardComponent,
    ],
    declarations: [
        PatientListComponent,
        PatientDetailsComponent,
        StatementComponent,
        PatientAttachmentsComponent,
        PatientRegistrationComponent,
        PatientCoversComponent,
        NextOfKinListComponent,
        PatientSearchComponent,
        PatientCoversComponent,
        PatientScreeningsComponent,
        PatientFollowUpsComponent,
        PatientReferralsComponent,
        PatientScreeningReportComponent,
        PatientPostReferralComponent,
        PatientConsentComponent,
        PatientTestsComponent,
        PatientMedicationRequestComponent,
        PatientMedicationRequestsComponent,
    ],
    providers: [
        SilStoresService,
        SilDatatableService,
        AuthenticationService,
        PatientService,
        StepperService,
    ],
})
export class PatientsModule {}
