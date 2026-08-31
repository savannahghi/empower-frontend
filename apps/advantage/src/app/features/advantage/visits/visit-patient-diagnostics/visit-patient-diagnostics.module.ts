import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitPatientDiagnosticsComponent } from './diagnostics/visit-patient-diagnostics.component';
import { VisitService } from '../visit.service';
import {
    NbButtonModule,
    NbCalendarModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbSpinnerModule,
    NbStepperModule,
    NbToastrModule,
    NbTooltipModule,
} from '@nebular/theme';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ThemeModule } from '../../../../@theme/theme.module';
import { FeaturesModule } from '../../../features.module';
import { SkikaFormModule } from '../../../../shared/sil-form/sil-form.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxTranslateModule } from '../../../../shared/translate/translate.module';
import { SkikaLayoutModule } from '../../../../shared/sil-layout/sil-layout.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { UIRouterModule } from '@uirouter/angular';
import { ActionCardComponent } from '../visit-patient-screening/screening-report/action-card/action-card.component';
import { SectionTitleComponent } from '../visit-patient-screening/screening-report/section-title/section-title.component';
import { DisplayCardComponent } from '../visit-patient-screening/screening-report/display-card/display-card.component';
import { VISIT_DIAGNOSTICS_STATES } from './visit-patient-diagnostics.state';
import { SilDatatableModule } from '../../../../shared/sil-datatable/sil-datatable.module';
import { SilDatatableService } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';

@NgModule({
    declarations: [VisitPatientDiagnosticsComponent],
    imports: [
        UIRouterModule.forChild({ states: VISIT_DIAGNOSTICS_STATES }),
        CommonModule,
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
        SilDatatableModule,
    ],
    providers: [VisitService, SilDatatableService],
})
export class VisitPatientDiagnosticsModule {}
