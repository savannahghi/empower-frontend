import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckInListComponent } from './check-in-list/check-in-list.component';
import { CHECKIN_STATES } from './check-in.states';
import { UIRouterModule } from '@uirouter/angular';
import { SilDatatableModule } from '../../../shared/sil-datatable/sil-datatable.module';
import { FeaturesModule } from '../../features.module';
import { SkikaFormModule } from '../../../shared/sil-form/sil-form.module';
import {
    NbAccordionModule,
    NbActionsModule,
    NbAlertModule,
    NbButtonModule,
    NbCalendarModule,
    NbCardModule,
    NbDatepickerModule,
    NbInputModule,
    NbSelectModule,
    NbThemeModule,
    NbToastrModule,
} from '@nebular/theme';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { SilDatatableService } from '../../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { AuthenticationService } from '../../../@core/auth/services/authentication.service';
import { PatientService } from '../patients/patient.service';
import { SkikaLayoutModule } from '../../../shared/sil-layout/sil-layout.module';
import { SilComboBoxModule } from '../../../shared/sil-combo-box/sil-combo-box.module';
import { ThemeModule } from '../../../@theme/theme.module';
import { AddFutureCheckInComponent } from './add-future-check-in/add-future-check-in.component';
import { NgxTranslateModule } from '../../../shared/translate/translate.module';
import { StartVisitModule } from '../../../shared/start-visit/start-visit/start-visit.module';

@NgModule({
    imports: [
        UIRouterModule.forChild({ states: CHECKIN_STATES }),
        CommonModule,
        SilDatatableModule,
        FeaturesModule,
        SkikaFormModule,
        NbCardModule,
        NbAccordionModule,
        NbInputModule,
        NbThemeModule,
        NbButtonModule,
        NbActionsModule,
        NbDatepickerModule,
        NbCalendarModule,
        NbSelectModule,
        NbAlertModule,
        SkikaLayoutModule,
        NbToastrModule,
        SilComboBoxModule,
        ThemeModule,
        StartVisitModule,
        NgxTranslateModule,
    ],
    declarations: [CheckInListComponent, AddFutureCheckInComponent],
    providers: [
        SilStoresService,
        SilDatatableService,
        AuthenticationService,
        PatientService,
    ],
})
export class CheckInModule {}
