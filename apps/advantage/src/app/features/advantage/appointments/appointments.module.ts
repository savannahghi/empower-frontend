import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AddAppointmentComponent } from './add-appointment/add-appointment.component';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../@core/auth/services/authentication.service';
import { APPOINTMENT_STATES } from './appointments.states';
import { UIRouterModule } from '@uirouter/angular';
import { SkikaFormModule } from '../../../shared/sil-form/sil-form.module';
import {
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCalendarModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbUserModule,
    NbTabsetModule,
    NbTagModule,
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
import { ThemeModule } from '../../../@theme/theme.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxTranslateModule } from '../../../shared/translate/translate.module';
import { StartVisitModule } from '../../../shared/start-visit/start-visit/start-visit.module';
import { SilCurrencyPipe } from '../../../@theme/pipes/currency/currency.pipe';
import { SendSmsComponent } from '../engagement/send-sms/send-sms.component';
import { StatusColorPipe } from '../../../@theme/pipes';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        UIRouterModule.forChild({ states: APPOINTMENT_STATES }),
        CommonModule,
        FormsModule,
        NbInputModule,
        NbCardModule,
        NbButtonModule,
        NbActionsModule,
        NbUserModule,
        NbCalendarModule,
        NbCheckboxModule,
        NbRadioModule,
        NbDatepickerModule,
        NbSelectModule,
        NbSpinnerModule,
        NbIconModule,
        NbListModule,
        NbThemeModule,
        NbTabsetModule,
        NbSpinnerModule,
        SkikaFormModule,
        FeaturesModule,
        NbTagModule,
        NbToastrModule,
        NbAlertModule,
        NbAccordionModule,
        NbTooltipModule,
        SilDatatableModule,
        SkikaLayoutModule,
        ThemeModule,
        SweetAlert2Module,
        StartVisitModule,
        NgxTranslateModule,
        SilCurrencyPipe,
        StatusColorPipe,
        SendSmsComponent,
        StatusColorPipe,
    ],
    declarations: [AppointmentListComponent, AddAppointmentComponent],
    providers: [SilStoresService, SilDatatableService, AuthenticationService],
})
export class AppointmentsModule {}
