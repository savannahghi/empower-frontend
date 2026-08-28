import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicListComponent } from './clinic-list/clinic-list.component';
import { ViewClinicComponent } from './view-clinic/view-clinic.component';
import { SchedulingInformationComponent } from './view-clinic/scheduling-information/scheduling-information.component';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../@core/auth/services/authentication.service';
import { CLINIC_STATES } from './clinics.states';
import { UIRouterModule } from '@uirouter/angular';
import { SkikaFormModule } from '../../../shared/sil-form/sil-form.module';
import { FeatureFlagPipe } from '../../../@theme/pipes/feature-flag/feature-flag.pipe';
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
import { DoctorsComponent } from './doctors/doctors.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SilComboBoxModule } from '../../../shared/sil-combo-box/sil-combo-box.module';
import { ClinicAvailabilityComponent } from './clinic-availability/clinic-availability.component';

@NgModule({
    imports: [
        UIRouterModule.forChild({ states: CLINIC_STATES }),
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
        FeatureFlagPipe,
    ],
    declarations: [
        ClinicListComponent,
        ViewClinicComponent,
        DoctorsComponent,
        ClinicAvailabilityComponent,
        SchedulingInformationComponent,
    ],
    providers: [SilStoresService, SilDatatableService, AuthenticationService],
})
export class ClinicsModule {}
