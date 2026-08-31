import {
    NbAccordionModule,
    NbButtonModule,
    NbCalendarModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbSpinnerModule,
    NbStepperModule,
    NbToastrModule,
    NbTooltipModule,
} from '@nebular/theme';
import { VisitService } from '../visit.service';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ThemeModule } from '../../../../@theme/theme.module';
import { FeaturesModule } from '../../../features.module';
import { SkikaFormModule } from '../../../../shared/sil-form/sil-form.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxTranslateModule } from '../../../../shared/translate/translate.module';
import { SkikaLayoutModule } from '../../../../shared/sil-layout/sil-layout.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { VisitPatientTreatmentComponent } from './treatment/visit-patient-treatment.component';
import { UIRouterModule } from '@uirouter/angular';
import { VISIT_TREATMENT_STATES } from './visit-patient-treatment.state';
import { ActionCardComponent } from '../visit-patient-screening/screening-report/action-card/action-card.component';
import { SectionTitleComponent } from '../visit-patient-screening/screening-report/section-title/section-title.component';
import { DisplayCardComponent } from '../visit-patient-screening/screening-report/display-card/display-card.component';
import { NgModule } from '@angular/core';
import { VisitDiagnosticComponent } from './visit-diagnostic/visit-diagnostic.component';
import { VisitRegimenComponent } from './visit-regimen/visit-regimen.component';
import { SilDatatableModule } from '../../../../shared/sil-datatable/sil-datatable.module';
import { SilDatatableService } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { VisitCareplanComponent } from './visit-careplan/visit-careplan.component';

/**
 * Creates the patient treatment module
 */
@NgModule({
    declarations: [VisitPatientTreatmentComponent],
    imports: [
        UIRouterModule.forChild({ states: VISIT_TREATMENT_STATES }),
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
        NbInputModule,
        NbRadioModule,
        NbSelectModule,
        NbToastrModule,
        NbTooltipModule,
        NgxSkeletonLoaderModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        SkikaFormModule,
        NbStepperModule,
        NbSpinnerModule,
        NgxTranslateModule,
        ActionCardComponent,
        SectionTitleComponent,
        DisplayCardComponent,
        VisitDiagnosticComponent,
        VisitRegimenComponent,
        VisitCareplanComponent,
        NbAccordionModule,
        NbFormFieldModule,
        SilDatatableModule,
    ],
    providers: [VisitService, SilDatatableService],
})
export class VisitPatientTreatmentModule {}
