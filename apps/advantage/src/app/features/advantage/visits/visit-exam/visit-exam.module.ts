import {
    CUSTOM_ELEMENTS_SCHEMA,
    NgModule,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { UIRouterModule } from '@uirouter/angular';

import {
    NbButtonModule,
    NbCalendarModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbFormFieldModule,
    NbIconModule,
    NbListModule,
    NbRadioModule,
    NbSelectModule,
    NbSpinnerModule,
    NbStepperModule,
    NbTabsetModule,
    NbTagModule,
    NbToastrModule,
    NbToggleModule,
} from '@nebular/theme';
import { VisitService } from '../visit.service';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ThemeModule } from '../../../../@theme/theme.module';
import { FeaturesModule } from '../../../features.module';
import { SkikaFormModule } from '../../../../shared/sil-form/sil-form.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StepperService } from '../../../../shared/component-services/stepper.service';
import { VISIT_EXAM_STATES } from './visit-exam.states';
import { VisitExamStepperComponent } from './visit-exam-stepper/visit-exam-stepper.component';
import { ExamRecordComponent } from './exam-record/exam-record.component';
import { NgxTranslateModule } from '../../../../shared/translate/translate.module';
import { NgPipesModule } from 'ngx-pipes';
import { PatientService } from '../../patients/patient.service';
import { ClinicalRecordsModule } from '../../clinical-records/clinical-records.module';
import { ExamReviewComponent } from './exam-review/exam-review.component';
import { ExamHistoryComponent } from './exam-history/exam-history.component';
import { ExaminationsComponent } from './examinations/examinations.component';
import { TreatmentPlanComponent } from './treatment-plan/treatment-plan.component';
import { SkikaLayoutModule } from '../../../../shared/sil-layout/sil-layout.module';
import { ExamDiagnosisComponent } from './treatment-plan/exam-diagnosis/exam-diagnosis.component';
import { ExamSignOffComponent } from './exam-sign-off/exam-sign-off.component';
import { AddMedicationRequestComponent } from './add-medication-request/add-medication-request.component';
import { AddLabOrderComponent } from './add-lab-order/add-lab-order.component';
import { ExamReferralsComponent } from './treatment-plan/exam-referrals/exam-referrals.component';
import { SilDatatableModule } from '../../../../shared/sil-datatable/sil-datatable.module';
import { SilDatatableService } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { AppPipe } from 'app/@theme/pipes';
import { DoseUnitPipe } from 'app/@theme/pipes/dose-unit/dose-unit.pipe';

/**
 * Module that creates Visit Exam Module.
 */
@NgModule({
    imports: [
        UIRouterModule.forChild({ states: VISIT_EXAM_STATES }),
        CommonModule,
        FeaturesModule,
        ThemeModule,
        NbCardModule,
        NbButtonModule,
        NbCheckboxModule,
        NbDatepickerModule,
        NbCalendarModule,
        NbIconModule,
        NbRadioModule,
        NbFormFieldModule,
        NbSelectModule,
        NbToggleModule,
        NbTagModule,
        NbListModule,
        NbToastrModule,
        NbSpinnerModule,
        NbTabsetModule,
        NgPipesModule,
        NgxSkeletonLoaderModule,
        ReactiveFormsModule,
        SilDatatableModule,
        NgxTranslateModule,
        FormsModule,
        SkikaFormModule,
        SkikaLayoutModule,
        NbStepperModule,
        NbSpinnerModule,
        ClinicalRecordsModule,
        AppPipe,
        DoseUnitPipe,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    declarations: [
        AddLabOrderComponent,
        AddMedicationRequestComponent,
        AddLabOrderComponent,
        VisitExamStepperComponent,
        ExamRecordComponent,
        ExamReviewComponent,
        ExamHistoryComponent,
        ExaminationsComponent,
        TreatmentPlanComponent,
        ExamDiagnosisComponent,
        ExamSignOffComponent,
        ExamReferralsComponent,
    ],
    providers: [
        VisitService,
        SilDatatableService,
        SilStoresService,
        StepperService,
        PatientService,
    ],
})
export class VisitExamModule {}
