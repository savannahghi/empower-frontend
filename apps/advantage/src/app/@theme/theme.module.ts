import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    NbActionsModule,
    NbLayoutModule,
    NbMenuModule,
    NbCardModule,
    NbSearchModule,
    NbToggleModule,
    NbSidebarModule,
    NbUserModule,
    NbContextMenuModule,
    NbButtonModule,
    NbSelectModule,
    NbListModule,
    NbSpinnerModule,
    NbIconModule,
    NbThemeModule,
    NbTagModule,
    NbTooltipModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbSecurityModule } from '@nebular/security';

import {
    FooterComponent,
    HeaderComponent,
    SearchInputComponent,
    PageHeaderComponent,
} from './components';
import {
    AgePipe,
    CapitalizePipe,
    ClaimStatusPipe,
    ClaimStatusColorPipe,
    DurationPipe,
    PayerNamePipe,
    PluralPipe,
    LoanStatusColorPipe,
    NumberWithCommasPipe,
    ReplaceWithPipe,
    RoundPipe,
    SilTimeAgoPipe,
    StatusDescriptionPipe,
    SplitPipe,
    TimingPipe,
    TitleCasePipe,
    TransitionStatusPipe,
    VisitAmountPipe,
    ObjectToArrayPipe,
    RemoveUnderScorePipe,
    VitalStatusPipe,
    AppPipe,
    MomentDatePipe,
} from './pipes';

import {
    OneColumnLayoutComponent,
    ThreeColumnsLayoutComponent,
    TwoColumnsLayoutComponent,
} from './layouts';
import { DEFAULT_THEME } from './styles/theme.default';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { CORPORATE_THEME } from './styles/theme.corporate';
import { DARK_THEME } from './styles/theme.dark';
import { AvailableDaysPipe } from './pipes/available-days/available-days.pipe';
import { UIRouterModule } from '@uirouter/angular';
import { BreadcrumbsComponent } from './components/breadcrumb/breadcrumbs.component';
import { StatusColorPipe } from './pipes/status-color/status-color.pipe';
import { DirectivesModule } from '../shared/directives/directive.module';
import { SilMenuComponent } from '../shared/sil-menu/sil-menu.component';
import { WalletBalanceComponent } from '../features/advantage/billing/wallet-balance/wallet-balance.component';
import { FeatureFlagPipe } from './pipes/feature-flag/feature-flag.pipe';
import { QuintusDatatablePipe } from './pipes/quintus-datatable/quintus-datatable.pipe';
import { environment } from '../../environments/environment';
import { HealthIdFormatterPipe } from './pipes/health-id/health-id.pipe';
import { VariantDisplayPipe } from './pipes/variant-display/variant-display.pipe';
import { VariantPipe } from './pipes/variant/variant.pipe';
import { PhoneNumberPipe } from './pipes/phone-number/phone-number.pipe';
import { TruncatePipe } from './pipes/truncate/truncate.pipe';
import { ReconciliationStatusPipe } from './pipes/reconciliation-status/reconciliation-status.pipe';
import { NotLoadedInvoicesRemarksPipe } from './pipes/not-loaded-invoices-remarks/not-loaded-invoices-remarks.pipe';
import { SkikaLayoutModule } from 'app/shared/sil-layout/sil-layout.module';

/**
 * defined the nebular modules imported in the themee module
 */
const NB_MODULES = [
    NbLayoutModule,
    UIRouterModule,
    NbMenuModule,
    NbUserModule,
    NbActionsModule,
    NbSearchModule,
    NbSidebarModule,
    NbCardModule,
    NbContextMenuModule,
    NbSecurityModule,
    NbSpinnerModule,
    NbTagModule,
    NbTooltipModule,
    NbToggleModule,
    NbButtonModule,
    NbSelectModule,
    NbIconModule,
    NbListModule,
    NbEvaIconsModule,
];

/**
 * Contains the components imported via the theme module
 */
const COMPONENTS = [
    HeaderComponent,
    FooterComponent,
    PageHeaderComponent,
    SearchInputComponent,
    BreadcrumbsComponent,
    OneColumnLayoutComponent,
    ThreeColumnsLayoutComponent,
    SilMenuComponent,
    TwoColumnsLayoutComponent,
];

const IMPORTED_MODULES = [
    WalletBalanceComponent,
    FeatureFlagPipe,
    TruncatePipe,
    SkikaLayoutModule,
];

/**
 * Imports the pipes defined in the theme module
 */
const PIPES = [
    AgePipe,
    AvailableDaysPipe,
    ClaimStatusPipe,
    ClaimStatusColorPipe,
    CapitalizePipe,
    DurationPipe,
    HealthIdFormatterPipe,
    NumberWithCommasPipe,
    PhoneNumberPipe,
    LoanStatusColorPipe,
    PayerNamePipe,
    PluralPipe,
    ReplaceWithPipe,
    RoundPipe,
    SilTimeAgoPipe,
    SplitPipe,
    StatusDescriptionPipe,
    TimingPipe,
    TitleCasePipe,
    TransitionStatusPipe,
    VisitAmountPipe,
    ObjectToArrayPipe,
    QuintusDatatablePipe,
    RemoveUnderScorePipe,
    VitalStatusPipe,
    MomentDatePipe,
    ReconciliationStatusPipe,
    NotLoadedInvoicesRemarksPipe,
];

/**
 * Defines what imports, exports and declarations
 * are part of this module
 */
@NgModule({
    imports: [
        CommonModule,
        DirectivesModule,
        VariantDisplayPipe,
        VariantPipe,
        AppPipe,
        StatusColorPipe,
        ...NB_MODULES,
        ...IMPORTED_MODULES,
    ],
    exports: [CommonModule, DirectivesModule, ...PIPES, ...COMPONENTS],
    declarations: [...COMPONENTS, ...PIPES],
})
export class ThemeModule {
    static forRoot(): ModuleWithProviders<ThemeModule> {
        return {
            ngModule: ThemeModule,
            providers: [
                ...NbThemeModule.forRoot(
                    {
                        name: environment.variant,
                    },
                    [DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME]
                ).providers,
            ],
        };
    }
}
