import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SilStoresService } from '../../shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../@core/auth/services/authentication.service';
import { UIRouterModule } from '@uirouter/angular';
import { SkikaFormModule } from '../../shared/sil-form/sil-form.module';
import {
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbCalendarModule,
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
import { ThemeModule } from '../../@theme/theme.module';
import { SkikaLayoutModule } from '../../shared/sil-layout/sil-layout.module';
import { SilDatatableService } from '../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { SilDatatableModule } from '../../shared/sil-datatable/sil-datatable.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FEEDBACK_STATES } from './feedback.states';
import { MultiSelectModule } from 'primeng/multiselect';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';
import { FeedbackSubmittedComponent } from './feedback-submitted/feedback-submitted.component';
import { FeedbackGoogleFormComponent } from './feedback-google-form/feedback-google-form.component';

@NgModule({
    imports: [
        UIRouterModule.forChild({ states: FEEDBACK_STATES }),
        ThemeModule,
        MultiSelectModule,
        SkikaLayoutModule,
        CommonModule,
        NbInputModule,
        NbCardModule,
        NbCalendarModule,
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
        SilDatatableModule,
        SkikaFormModule,
        NbToastrModule,
        NbAlertModule,
        NbAccordionModule,
        NbTooltipModule,
        SweetAlert2Module,
    ],
    declarations: [
        FeedbackFormComponent,
        FeedbackSubmittedComponent,
        FeedbackGoogleFormComponent,
    ],
    providers: [SilStoresService, AuthenticationService, SilDatatableService],
})
export class FeedbackModule {}
