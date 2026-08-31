import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SilStoresService } from '../../shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../@core/auth/services/authentication.service';
import { ADVANTAGE_STATES } from './advantage.states';
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
    NbLayoutModule,
    NbSidebarModule,
} from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ThemeModule } from '../../@theme/theme.module';
import { SkikaLayoutModule } from '../../shared/sil-layout/sil-layout.module';
import { SilDatatableService } from '../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { SilDatatableModule } from '../../shared/sil-datatable/sil-datatable.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatrixRoomsComponent } from '../../shared/matrix/matrix-rooms/matrix-rooms.component';
import { WINDOW_PROVIDERS } from '../services/window.service';
import { NgxTranslateModule } from '../../shared/translate/translate.module';
import { FeatureFlagService } from '../../@core/utils/feature.service';
@NgModule({
    imports: [
        UIRouterModule.forChild({ states: ADVANTAGE_STATES }),
        ThemeModule,
        CommonModule,
        NbInputModule,
        NbCardModule,
        NbCalendarModule,
        NbButtonModule,
        NbActionsModule,
        NbAccordionModule,
        NbCheckboxModule,
        NbRadioModule,
        NbDatepickerModule,
        NbSelectModule,
        NbIconModule,
        NbLayoutModule,
        NbListModule,
        NbSidebarModule,
        NbUserModule,
        NbThemeModule,
        NbToastrModule,
        NbTabsetModule,
        NbAlertModule,
        NbSpinnerModule,
        NbTooltipModule,
        SkikaLayoutModule,
        SilDatatableModule,
        SkikaFormModule,
        SweetAlert2Module,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatrixRoomsComponent,
        NgxTranslateModule,
    ],
    providers: [
        SilStoresService,
        AuthenticationService,
        SilDatatableService,
        FeatureFlagService,
        WINDOW_PROVIDERS,
    ],
})
export class AdvantageModule {}
