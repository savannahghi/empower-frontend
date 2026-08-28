import { InboxComponent } from './inbox-component/inbox.component';
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
import { INBOX_STATES } from './inbox.states';
import { MatrixRoomsComponent } from '../../../shared/matrix/matrix-rooms/matrix-rooms.component';

@NgModule({
    declarations: [InboxComponent],
    providers: [SilStoresService, SilDatatableService, AuthenticationService],
    imports: [
        UIRouterModule.forChild({ states: INBOX_STATES }),
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
        MatrixRoomsComponent,
    ],
})
export class InboxModule {}
