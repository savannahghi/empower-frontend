import { CommonModule } from '@angular/common';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NgModule,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    NbAccordionModule,
    NbActionsModule,
    NbAlertModule,
    NbButtonModule,
    NbCalendarModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbIconModule,
    NbInputModule,
    NbListModule,
    NbRadioModule,
    NbSelectModule,
    NbSpinnerModule,
    NbTabsetModule,
    NbTagModule,
    NbThemeModule,
    NbToastrModule,
    NbTooltipModule,
    NbUserModule,
} from '@nebular/theme';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { UIRouterModule } from '@uirouter/angular';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AuthenticationService } from '../../../@core/auth/services/authentication.service';
import { VariantPipe } from '../../../@theme/pipes/variant/variant.pipe';
import { ThemeModule } from '../../../@theme/theme.module';
import { SilComboBoxModule } from '../../../shared/sil-combo-box/sil-combo-box.module';
import { SilDatatableService } from '../../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { SilDatatableModule } from '../../../shared/sil-datatable/sil-datatable.module';
import { SkikaFormModule } from '../../../shared/sil-form/sil-form.module';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { SkikaLayoutModule } from '../../../shared/sil-layout/sil-layout.module';
import { StartVisitModule } from '../../../shared/start-visit/start-visit/start-visit.module';
import { NgxTranslateModule } from '../../../shared/translate/translate.module';
import { PatientService } from '../patients/patient.service';
import { HomePageComponent } from './home-page/home-page.component';
import { HOME_STATES } from './home.states';
import { ProviderBranchesDetailsComponent } from './provider-details/provider-branches-details/provider-branches-details.component';
import { ProviderDetailsComponent } from './provider-details/provider-details.component';
import { ProviderFeaturesDetailsComponent } from './provider-details/provider-features-details/provider-features-details.component';
import { ProviderListingComponent } from './provider-listing/provider-listing.component';
import { ProviderRegistrationComponent } from './provider-registration/provider-registration.component';
import { ViewAppointmentComponent } from './view-appointment/view-appointment.component';

@NgModule({
    imports: [
        UIRouterModule.forChild({ states: HOME_STATES }),
        ThemeModule,
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
        SilComboBoxModule,
        StartVisitModule,
        NgxTranslateModule,
        FormsModule,
        ReactiveFormsModule,
        VariantPipe,
        NgxSkeletonLoaderModule,
        NbTagModule,
    ],
    declarations: [
        HomePageComponent,
        ViewAppointmentComponent,
        ProviderListingComponent,
        ProviderRegistrationComponent,
        ProviderDetailsComponent,
        ProviderBranchesDetailsComponent,
        ProviderFeaturesDetailsComponent,
    ],
    providers: [
        SilStoresService,
        PatientService,
        AuthenticationService,
        SilDatatableService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class HomeModule {}
