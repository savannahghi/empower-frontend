import { NgModule } from '@angular/core';
import {
    NbThemeModule,
    NbStepperModule,
    NbCalendarModule,
    NbLayoutModule,
    NbFormFieldModule,
    NbTimepickerModule,
    NbDialogModule,
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
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
    NbSpinnerModule,
    NbToastrModule,
    NbAlertModule,
    NbAccordionModule,
    NbTooltipModule,
} from '@nebular/theme';
import { ThemeModule } from '../../../@theme/theme.module';
import { SkikaFormModule } from '../../../shared/sil-form/sil-form.module';
import { NbToastrService } from '@nebular/theme';
import { LendingRoutingModule } from './lending-routing.module';
import { LendingBaseComponent } from './lending.component';
import {
    FormsModule as ngFormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { SilGraphQlModule } from '../../../shared/sil-graphql/sil-graphql.module';
import { SilHttpModule } from '../../../shared/sil-http-services/sil-http-services.module';
import { SilTableFormModule } from '../../../shared/sil-table-form/sil-table-form.module';
import { SkikaLayoutModule } from '../../../shared/sil-layout/sil-layout.module';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../shared/sil-http-services/error-handler';
import { NgSelectModule } from '@ng-select/ng-select';
import { SilDatatableModule } from '../../../shared/sil-datatable/sil-datatable.module';
@NgModule({
    imports: [
        ThemeModule,
        NbInputModule,
        NbCardModule,
        NbButtonModule,
        NbActionsModule,
        NbUserModule,
        NbCheckboxModule,
        NbRadioModule,
        NbDatepickerModule,
        LendingRoutingModule,
        NbSelectModule,
        NbIconModule,
        NbListModule,
        NbThemeModule,
        NgxEchartsModule,
        NbTabsetModule,
        NbAlertModule,
        NbSpinnerModule,
        NbCalendarModule,
        ngFormsModule,
        SilGraphQlModule,
        NbToastrModule,
        SilHttpModule,
        SilDatatableModule,
        SilTableFormModule,
        SkikaLayoutModule,
        NgSelectModule,
        SkikaFormModule,
        NbStepperModule,
        NbAccordionModule,
        NbTooltipModule,
        NbLayoutModule,
        NbFormFieldModule,
        NbTimepickerModule,
        ReactiveFormsModule,
        NbDialogModule.forRoot(),
    ],
    declarations: [LendingBaseComponent],
    exports: [],
    providers: [SilStoresService, ErrorHandlerService, NbToastrService],
})
export class LendingModule {}
