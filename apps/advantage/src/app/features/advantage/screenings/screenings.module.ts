import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../@core/auth/services/authentication.service';
import { UIRouterModule } from '@uirouter/angular';
import { SkikaFormModule } from '../../../shared/sil-form/sil-form.module';
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
import { SilDatatableModule } from '../../../shared/sil-datatable/sil-datatable.module';
import { FeaturesModule } from '../../features.module';
import { SilDatatableService } from '../../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { SkikaLayoutModule } from '../../../shared/sil-layout/sil-layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxTranslateModule } from '../../../shared/translate/translate.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { SilComboBoxModule } from '../../../shared/sil-combo-box/sil-combo-box.module';
import { SCREENINGS_STATES } from './screenings.states';
import { ScreeningsListComponent } from './screenings-list/screenings-list.component';
import { ScreeningReportComponent } from '../visits/visit-patient-screening/screening-report/screening-report.component';
import { ExaminationsListComponent } from './examinations-list/examinations-list.component';
import { ExaminationsDetailsComponent } from './examinations-details/examinations-details.component';
import { ThemeModule } from 'app/@theme/theme.module';

@NgModule({
    imports: [
        UIRouterModule.forChild({ states: SCREENINGS_STATES }),
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
        FeaturesModule,
        NbToastrModule,
        NbAlertModule,
        NbAccordionModule,
        NbTooltipModule,
        SilDatatableModule,
        SkikaLayoutModule,
        ReactiveFormsModule,
        FormsModule,
        NgxTranslateModule,
        SilComboBoxModule,
        NgSelectModule,
        ThemeModule,
        ScreeningReportComponent,
        ExaminationsDetailsComponent,
    ],
    declarations: [ScreeningsListComponent, ExaminationsListComponent],
    providers: [SilStoresService, SilDatatableService, AuthenticationService],
})
export class ScreeningsModule {}
