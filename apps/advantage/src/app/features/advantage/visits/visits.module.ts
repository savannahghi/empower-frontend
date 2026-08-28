import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitListComponent } from './visit-list/visit-list.component';
import { VisitDetailsComponent } from './visit-details/visit-details.component';
import { VisitBillingComponent } from './visit-billing/visit-billing.component';
import { VisitPaymentComponent } from './visit-payment/visit-payment.component';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../@core/auth/services/authentication.service';
import { VISIT_STATES } from './visits.states';
import { UIRouterModule } from '@uirouter/angular';
import { SkikaFormModule } from '../../../shared/sil-form/sil-form.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgPipesModule } from 'ngx-pipes';
import {
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbCalendarModule,
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
    NbTagModule,
    NbAlertModule,
    NbAccordionModule,
    NbTooltipModule,
    NbStepperModule,
    NbFormFieldModule,
    NbTimepickerModule,
} from '@nebular/theme';
import { SilDatatableModule } from '../../../shared/sil-datatable/sil-datatable.module';
import { FeaturesModule } from '../../features.module';
import { SilDatatableService } from '../../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { SkikaLayoutModule } from '../../../shared/sil-layout/sil-layout.module';
import { ThemeModule } from '../../../@theme/theme.module';
import { VisitService } from './visit.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { VisitInvoiceComponent } from './visit-invoice/visit-invoice.component';
import { PatientDetailsTimelineComponent } from '../patients/patient-details/patient-details-timeline/patient-details-timeline.component';
import { BookReviewAppointmentComponent } from '../appointments/book-review-appointment/book-review-appointment.component';
import { SilComboBoxModule } from '../../../shared/sil-combo-box/sil-combo-box.module';
import { FeatureFlagPipe } from '../../../@theme/pipes/feature-flag/feature-flag.pipe';
import { NgxTranslateModule } from '../../../shared/translate/translate.module';
import { SilCurrencyPipe } from '../../../@theme/pipes/currency/currency.pipe';
import { PatientService } from '../patients/patient.service';
import { StartVisitComponent } from './visit-start-visit/visit-start-visit.component';
import { TooltipModule } from 'primeng/tooltip';
import { PatientCoverModule } from '../patients/patient-cover/patient-cover.module';
import { VariantPipe } from '../../../@theme/pipes/variant/variant.pipe';
import { StatusColorPipe } from '../../../@theme/pipes';
import { SendSmsComponent } from '../engagement/send-sms/send-sms.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VisitReferralComponent } from './visit-referral/visit-referral.component';
import { ReferralFormComponent } from './visit-patient-screening/referral-form/referral-form.component';
import { PositiveResultComponent } from './visit-referral/positive-result/positive-result.component';
import { VisitTestComponent } from './visit-test/visit-test.component';
import { VisitTestCervicalComponent } from './visit-test/visit-test-cervical/visit-test-cervical.component';
import { MedicationRequestComponent } from './visit-patient-screening/medication-request/medication-request.component';
import { VisitMedicationRequestComponent } from './visit-medication-request/visit-medication-request.component';
import { VisitMedicationRequestsComponent } from './visit-medication-requests/visit-medication-requests.component';
import { VisitLabOrdersComponent } from './visit-lab-orders/visit-lab-orders.component';
import { VisitTestProstateComponent } from './visit-test/visit-test-prostate/visit-test-prostate.component';
import { PatientTimelineComponent } from '../patients/patient-timeline/patient-timeline.component';

@NgModule({
    declarations: [
        VisitListComponent,
        VisitDetailsComponent,
        VisitBillingComponent,
        VisitPaymentComponent,
        VisitInvoiceComponent,
        StartVisitComponent,
        VisitMedicationRequestComponent,
        VisitMedicationRequestsComponent,
        VisitLabOrdersComponent,
    ],
    providers: [
        VisitService,
        SilStoresService,
        SilDatatableService,
        AuthenticationService,
        PatientService,
    ],
    imports: [
        UIRouterModule.forChild({ states: VISIT_STATES }),
        CommonModule,
        FeaturesModule,
        NbCalendarModule,
        NbInputModule,
        NbCardModule,
        NbButtonModule,
        NbActionsModule,
        NbUserModule,
        NbCheckboxModule,
        NbRadioModule,
        NbDatepickerModule,
        NbTimepickerModule,
        NbFormFieldModule,
        NbSelectModule,
        NbIconModule,
        NbListModule,
        NbThemeModule,
        NbTabsetModule,
        NbTagModule,
        NbSpinnerModule,
        NbToastrModule,
        NbAlertModule,
        NbAccordionModule,
        NbTooltipModule,
        NgPipesModule,
        NgxSkeletonLoaderModule,
        SilDatatableModule,
        SweetAlert2Module,
        SkikaFormModule,
        SkikaLayoutModule,
        ThemeModule,
        SilComboBoxModule,
        FeatureFlagPipe,
        PatientDetailsTimelineComponent,
        BookReviewAppointmentComponent,
        SilCurrencyPipe,
        NgxTranslateModule,
        NbStepperModule,
        TooltipModule,
        VariantPipe,
        PatientCoverModule,
        StatusColorPipe,
        SendSmsComponent,
        NgxExtendedPdfViewerModule,
        FormsModule,
        ReactiveFormsModule,
        ReferralFormComponent,
        MedicationRequestComponent,
        VisitTestComponent,
        VisitTestCervicalComponent,
        VisitTestProstateComponent,
        VisitReferralComponent,
        PositiveResultComponent,
        PatientTimelineComponent,
    ],
    exports: [VisitBillingComponent],
})
export class VisitsModule {}
