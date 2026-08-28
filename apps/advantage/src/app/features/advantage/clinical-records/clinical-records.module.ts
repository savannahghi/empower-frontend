import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../@core/auth/services/authentication.service';
import { SkikaFormModule } from '../../../shared/sil-form/sil-form.module';
import { ClinicalRecordsComponent } from './clinical-records.component';
import { VitalResultComponent } from './vital-result/vital-result.component';
import { PatientProblemComponent } from './problem/patient-problem.component';
import { PatientAllergyComponent } from './allergy/patient-allergy.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ThemeModule } from '../../../@theme/theme.module';
import { GetConditionListFromOcl } from '../../services/clinical-ocl.service';
import { ClinicalRecordsService } from './clinical-records.service';
import {
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCalendarModule,
    NbTimepickerModule,
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
} from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { SilDatatableModule } from '../../../shared/sil-datatable/sil-datatable.module';
import { FeaturesModule } from '../../features.module';
import { SilComboBoxModule } from '../../../shared/sil-combo-box/sil-combo-box.module';
import { SilDatatableService } from '../../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { SkikaLayoutModule } from '../../../shared/sil-layout/sil-layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientTimelineComponent } from '../patients/patient-timeline/patient-timeline.component';
import { PatientService } from '../patients/patient.service';
import { FeatureFlagPipe } from '../../../@theme/pipes/feature-flag/feature-flag.pipe';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PatientDiagnosisComponent } from './diagnosis/patient-diagnosis.component';
import { PatientCompositionComponent } from './composition/patient-composition.component';
import { NgxTranslateModule } from '../../../shared/translate/translate.module';
import { GeneralSystemsComponent } from './general-systems/general-systems.component';
import { PatientObservationComponent } from './observation/patient-observation.component';
import { ClinicalRecordsSummaryComponent } from './clinical-records-summary/clinical-records-summary.component';

@NgModule({
    imports: [
        CommonModule,
        NbInputModule,
        NbCardModule,
        NbButtonModule,
        NbActionsModule,
        NbUserModule,
        NbCalendarModule,
        NbTimepickerModule,
        NbCheckboxModule,
        NbRadioModule,
        NbDatepickerModule,
        NbSelectModule,
        NbIconModule,
        NbListModule,
        NbThemeModule,
        NbTabsetModule,
        NbSpinnerModule,
        SkikaFormModule,
        SilComboBoxModule,
        NgxSkeletonLoaderModule,
        FeaturesModule,
        NbToastrModule,
        NbAlertModule,
        NbAccordionModule,
        NbTooltipModule,
        SilDatatableModule,
        NgSelectModule,
        SkikaLayoutModule,
        ReactiveFormsModule,
        FormsModule,
        ThemeModule,
        PatientTimelineComponent,
        FeatureFlagPipe,
        CKEditorModule,
        NgxTranslateModule,
    ],
    declarations: [
        ClinicalRecordsComponent,
        VitalResultComponent,
        PatientProblemComponent,
        PatientAllergyComponent,
        PatientDiagnosisComponent,
        PatientCompositionComponent,
        GeneralSystemsComponent,
        PatientObservationComponent,
        ClinicalRecordsSummaryComponent,
    ],
    exports: [
        VitalResultComponent,
        PatientAllergyComponent,
        PatientProblemComponent,
        PatientDiagnosisComponent,
        PatientCompositionComponent,
        GeneralSystemsComponent,
        PatientObservationComponent,
        ClinicalRecordsSummaryComponent,
    ],
    providers: [
        SilStoresService,
        SilDatatableService,
        AuthenticationService,
        ClinicalRecordsService,
        GetConditionListFromOcl,
        PatientService,
    ],
})
export class ClinicalRecordsModule {}
