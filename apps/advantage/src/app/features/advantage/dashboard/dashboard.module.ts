import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIRouterModule } from '@uirouter/angular';
import { DASHBOARD_STATES } from './dashboard.states';
import { FeatureFlagPipe } from '../../../@theme/pipes/feature-flag/feature-flag.pipe';
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
    NbLayoutModule,
    NbSidebarModule,
    NbTagModule,
} from '@nebular/theme';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../../@theme/theme.module';
import { SilDatatableModule } from '../../../shared/sil-datatable/sil-datatable.module';
import { NgxTranslateModule } from '../../../shared/translate/translate.module';
import { SilCurrencyPipe } from '../../../@theme/pipes/currency/currency.pipe';
import { EmbeddedDashboardModule } from '../../../shared/embedded-dashboard/embedded-dashboard.module';

@NgModule({
    imports: [
        UIRouterModule.forChild({ states: DASHBOARD_STATES }),
        CommonModule,
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
        ThemeModule,
        FormsModule,
        ReactiveFormsModule,
        SelectButtonModule,
        NbLayoutModule,
        NbSidebarModule,
        SilDatatableModule,
        NgxTranslateModule,
        SilCurrencyPipe,
        FeatureFlagPipe,
        EmbeddedDashboardModule,
    ],
    declarations: [],
    exports: [],
})
export class DashboardModule {}
