import { NgModule } from '@angular/core';
import { UIRouterModule } from '@uirouter/angular';

import { VISIT_SCREENING_STATES } from './visit-patient-screening.states';
import { ScreeningChoiceComponent } from './screening-choice/screening-choice.component';
import {
    NbButtonModule,
    NbCalendarModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbIconModule,
    NbRadioModule,
    NbSelectModule,
    NbSpinnerModule,
    NbStepperModule,
    NbToastrModule,
} from '@nebular/theme';
import { VisitService } from '../visit.service';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ThemeModule } from '../../../../@theme/theme.module';
import { FeaturesModule } from '../../../features.module';
import { SkikaFormModule } from '../../../../shared/sil-form/sil-form.module';
import { ConsentComponent } from './consent/consent.component';
import { ScreeningTypeComponent } from './cervical-cancer-screening/screening-type/screening-type.component';
import { RiskAssessmentComponent } from './risk-assessment/risk-assessment.component';
import { RiskStratificationComponent } from './risk-stratification/risk-stratification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreastCancerScreeningComponent } from './breast-cancer-screening/breast-cancer-screening.component';
import { FollowUpComponent } from './follow-up/follow-up.component';
import { NegativeResultComponent } from './follow-up/negative-result/negative-result.component';
import { SuspiciousResultComponent } from './follow-up/suspicious-result/suspicious-result.component';
import { ScreeningService } from './screening.service';
import { ScreeningTypeBreastComponent } from './breast-cancer-screening/screening-type-breast/screening-type-breast.component';
import { ReferralFormComponent } from './referral-form/referral-form.component';
import { EndScreeningComponent } from './end-screening/end-screening.component';
import { FinishedScreeningComponent } from './finished-screening/finished-screening.component';
import { WaitingResultComponent } from './waiting-result/waiting-result.component';
import { StepperService } from '../../../../shared/component-services/stepper.service';
import { ScreeningReportComponent } from './screening-report/screening-report.component';
import { ScreeningSummaryComponent } from './screening-summary/screening-summary.component';
import { VisitPatientScreeningComponent } from './screening/visit-patient-screening.component';
import { ScreeningRecordComponent } from './screening-record/screening-record.component';
import { NgxTranslateModule } from '../../../../shared/translate/translate.module';
import { ScreeningConsentComponent } from './screening-record/consent/consent.component';
import { CervicalCancerScreeningComponent } from './cervical-cancer-screening/cervical-cancer-screening.component';
import { DisplayCardComponent } from './screening-report/display-card/display-card.component';
import { SectionTitleComponent } from './screening-report/section-title/section-title.component';
import { ActionCardComponent } from './screening-report/action-card/action-card.component';
import { QuestionnaireModule } from '../../questionnaire/questionnaire.module';
import { SkikaLayoutModule } from '../../../../shared/sil-layout/sil-layout.module';
import { ScreeningAssessmentComponent } from './screening-record/assessment/screening-assessment.component';
import { VisitTestComponent } from '../visit-test/visit-test.component';
import { VisitTestCervicalComponent } from '../visit-test/visit-test-cervical/visit-test-cervical.component';
import { VisitReferralComponent } from '../visit-referral/visit-referral.component';
import { PositiveResultComponent } from '../visit-referral/positive-result/positive-result.component';
import { NgSelectModule } from '@ng-select/ng-select';

/**
 * Module that creates Patient Screening Module.
 */
@NgModule({
    imports: [
        UIRouterModule.forChild({ states: VISIT_SCREENING_STATES }),
        CommonModule,
        FeaturesModule,
        ThemeModule,
        NbCardModule,
        NbButtonModule,
        SkikaLayoutModule,
        NbCheckboxModule,
        NbDatepickerModule,
        NbCalendarModule,
        NbIconModule,
        NbRadioModule,
        NbSelectModule,
        NbToastrModule,
        NgxSkeletonLoaderModule,
        ScreeningReportComponent,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        SkikaFormModule,
        ReferralFormComponent,
        EndScreeningComponent,
        ScreeningSummaryComponent,
        NbStepperModule,
        NbSpinnerModule,
        NgxTranslateModule,
        ActionCardComponent,
        SectionTitleComponent,
        DisplayCardComponent,
        VisitTestComponent,
        VisitTestCervicalComponent,
        VisitReferralComponent,
        PositiveResultComponent,
        QuestionnaireModule,
    ],
    declarations: [
        VisitPatientScreeningComponent,
        ScreeningChoiceComponent,
        CervicalCancerScreeningComponent,
        BreastCancerScreeningComponent,
        ConsentComponent,
        ScreeningTypeComponent,
        ScreeningTypeBreastComponent,
        RiskAssessmentComponent,
        FollowUpComponent,
        NegativeResultComponent,
        SuspiciousResultComponent,
        FinishedScreeningComponent,
        WaitingResultComponent,
        ScreeningRecordComponent,
        ScreeningConsentComponent,
        ScreeningAssessmentComponent,
        RiskStratificationComponent,
    ],
    providers: [
        VisitService,
        SilStoresService,
        ScreeningService,
        StepperService,
    ],
})
export class VisitPatientScreeningModule {}
