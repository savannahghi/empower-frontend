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
    NbLayoutModule,
} from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { SkikaLayoutModule } from '../../shared/sil-layout/sil-layout.module';
import { SilDatatableService } from '../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { SilDatatableModule } from '../../shared/sil-datatable/sil-datatable.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TosDocumentComponent } from './tos-document/tos-document.component';
import { TOS_STATES } from './tos.states';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { VariantDisplayPipe } from '../../@theme/pipes/variant-display/variant-display.pipe';

@NgModule({
    imports: [
        UIRouterModule.forChild({ states: TOS_STATES }),
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
        NbLayoutModule,
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
        NgxExtendedPdfViewerModule,
        VariantDisplayPipe,
    ],
    declarations: [TosDocumentComponent],
    providers: [SilStoresService, AuthenticationService, SilDatatableService],
})
export class TosModule {}
