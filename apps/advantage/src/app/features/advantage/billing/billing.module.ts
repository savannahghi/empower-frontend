import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmsListComponent } from './sms-list/sms-list.component';
import { BILLING_STATES } from './billing.states';
import { UIRouterModule } from '@uirouter/angular';
import { FeaturesModule } from '../../features.module';
import { SilDatatableService } from '../../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { SilDatatableModule } from '../../../shared/sil-datatable/sil-datatable.module';
import { ThemeModule } from '../../../@theme/theme.module';
import { AuthenticationService } from '../../../@core/auth/services/authentication.service';
import { SkikaLayoutModule } from '../../../shared/sil-layout/sil-layout.module';
import { SkikaFormModule } from '../../../shared/sil-form/sil-form.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
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
    NbTagModule,
} from '@nebular/theme';
import { NgPipesModule } from 'ngx-pipes';
import { NgxTranslateModule } from '../../../shared/translate/translate.module';
import { DirectivesModule } from '../../../shared/directives/directive.module';

@NgModule({
    imports: [
        UIRouterModule.forChild({ states: BILLING_STATES }),
        CommonModule,
        NbInputModule,
        NbCardModule,
        NbButtonModule,
        NbActionsModule,
        NbUserModule,
        NbCheckboxModule,
        NbRadioModule,
        NbDatepickerModule,
        NbSelectModule,
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
        SkikaLayoutModule,
        SilDatatableModule,
        SkikaFormModule,
        SweetAlert2Module,
        ThemeModule,
        FeaturesModule,
        NgxTranslateModule,
        DirectivesModule,
    ],
    declarations: [SmsListComponent],
    providers: [SilStoresService, SilDatatableService, AuthenticationService],
})
export class BillingModule {}
