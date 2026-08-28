/* eslint-disable @typescript-eslint/no-unused-vars */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../patient.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { SilDatatableService } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { PatientSegmentsComponent } from './patient-segments.component';
import { PATIENT_SEGMENT_STATES } from './patient-segments.states';
import {
    NbAccordionModule,
    NbActionsModule,
    NbAlertModule,
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NbListModule,
    NbSpinnerModule,
    NbTabsetModule,
    NbTagModule,
    NbThemeModule,
    NbToastrModule,
    NbTooltipModule,
    NbUserModule,
} from '@nebular/theme';
import { NgxTranslateModule } from '../../../../shared/translate/translate.module';
import { ScreeningReportComponent } from '../../visits/visit-patient-screening/screening-report/screening-report.component';
import { StatusColorPipe } from '../../../../@theme/pipes';
import { PatientDetailsTimelineComponent } from '../patient-details/patient-details-timeline/patient-details-timeline.component';
import { VariantPipe } from '../../../../@theme/pipes/variant/variant.pipe';
import { ThemeModule } from '../../../../@theme/theme.module';
import { SkikaLayoutModule } from '../../../../shared/sil-layout/sil-layout.module';
import { SilDatatableModule } from '../../../../shared/sil-datatable/sil-datatable.module';
import { SkikaFormModule } from '../../../../shared/sil-form/sil-form.module';
import { FeaturesModule } from '../../../features.module';
import { NgPipesModule } from 'ngx-pipes';
import { UIRouterModule } from '@uirouter/angular';
import { PatientSegmentMessagesComponent } from './patient-segment-messages/patient-segment-messages.component';

@NgModule({
    imports: [
        UIRouterModule.forChild({ states: PATIENT_SEGMENT_STATES }),
        CommonModule,
        NbCardModule,
        NbButtonModule,
        NbActionsModule,
        NbUserModule,
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
        FeaturesModule,
        SkikaFormModule,
        SilDatatableModule,
        SkikaLayoutModule,
        ThemeModule,
        VariantPipe,
        NgxTranslateModule,
        PatientDetailsTimelineComponent,
        StatusColorPipe,
        ScreeningReportComponent,
    ],
    declarations: [PatientSegmentsComponent, PatientSegmentMessagesComponent],
    providers: [
        SilStoresService,
        SilDatatableService,
        AuthenticationService,
        PatientService,
    ],
})
export class PatientSegmentsModule {}
