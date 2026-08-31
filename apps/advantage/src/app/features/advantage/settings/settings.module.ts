import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../@core/auth/services/authentication.service';
import { SETTING_STATES } from './settings.states';
import { UIRouterModule } from '@uirouter/angular';
import { SkikaFormModule } from '../../../shared/sil-form/sil-form.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    NbStepperModule,
} from '@nebular/theme';
import { SilDatatableModule } from '../../../shared/sil-datatable/sil-datatable.module';
import { FeaturesModule } from '../../features.module';
import { SilDatatableService } from '../../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { SkikaLayoutModule } from '../../../shared/sil-layout/sil-layout.module';
import { ThemeModule } from '../../../@theme/theme.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SettingListComponent } from './setting-list/setting-list.component';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { JsonFormBuilderComponent } from './json-form-builder/json-form-builder.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { GroupMembersComponent } from './group-members/group-members.component';
import { NgxTranslateModule } from '../../../shared/translate/translate.module';
import { PriceListComponent } from './pricelist-list/pricelist-list.component';
import { PricelistDetailsComponent } from './pricelist-details/pricelist-details.component';
import { SilPhoneCountryCodePipe } from '../../../@theme/pipes/phone-number-country-code/phone-number-country-code.pipe';
import { NewSalesPricelistComponent } from './new-sales-pricelist/new-sales-pricelist.component';
import { ProductListComponent } from './product-list/ngx-product-list.component';
import { BranchSettingListComponent } from './branchsetting-list/branchsetting-list.component';
import { StepperService } from '../../../shared/component-services/stepper.service';
import { OrganisationUpdateComponent } from './organisation-update/organisation-update.component';
import { BranchDetailsComponent } from './branch-details/branch-details.component';
import { AddProductComponent } from './add-product/add-product.component';
import { BranchCustomersComponent } from './branch-customers/branch-customers.component';
import { BranchDetailsBannerComponent } from './branch-details-banner/branch-details-banner.component';
import { ImportDetailsComponent } from './import-details/import-details.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { StatusColorPipe } from '../../../@theme/pipes';
import { FeatureFlagPipe } from '../../../@theme/pipes/feature-flag/feature-flag.pipe';
import { VariantPipe } from '../../../@theme/pipes/variant/variant.pipe';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { NewPaymentMethodsComponent } from './new-payment-methods/new-payment-methods.component';
import { OperatingRegionsComponent } from './operating-regions/operating-regions.component';
import { ClusterDetailsBannerComponent } from './clusters/cluster-details-banner/cluster-details-banner.component';
import { ClusterDetailsComponent } from './clusters/cluster-details/cluster-details.component';
import { ClusterBranchesComponent } from './clusters/cluster-branches/cluster-branches.component';
import { PricelistBulkUploadComponent } from './pricelist-bulk-upload/pricelist-bulk-upload.component';
import { SilComboBoxModule } from '../../../shared/sil-combo-box/sil-combo-box.module';
import { PricelistFileUploadDetailsComponent } from './pricelist-file-upload-details/pricelist-file-upload-details.component';
import { PricelistLocationComponent } from './pricelist-location/pricelist-location.component';

@NgModule({
    imports: [
        UIRouterModule.forChild({ states: SETTING_STATES }),
        CommonModule,
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
        NbIconModule,
        NbListModule,
        NbThemeModule,
        NbSpinnerModule,
        NbStepperModule,
        NbTabsetModule,
        SkikaFormModule,
        FormsModule,
        ReactiveFormsModule,
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
        JsonFormBuilderComponent,
        NgxTranslateModule,
        SilPhoneCountryCodePipe,
        ProductListComponent,
        NgxSkeletonLoaderModule,
        StatusColorPipe,
        FeatureFlagPipe,
        VariantPipe,
        SilComboBoxModule,
    ],
    declarations: [
        SettingListComponent,
        FormBuilderComponent,
        GroupDetailsComponent,
        GroupMembersComponent,
        PriceListComponent,
        PricelistDetailsComponent,
        NewSalesPricelistComponent,
        BranchSettingListComponent,
        OrganisationUpdateComponent,
        BranchDetailsComponent,
        AddProductComponent,
        BranchCustomersComponent,
        BranchDetailsBannerComponent,
        ClusterDetailsBannerComponent,
        ClusterDetailsComponent,
        ClusterBranchesComponent,
        ImportDetailsComponent,
        PaymentMethodsComponent,
        NewPaymentMethodsComponent,
        OperatingRegionsComponent,
        PricelistBulkUploadComponent,
        PricelistFileUploadDetailsComponent,
        PricelistLocationComponent,
    ],
    providers: [
        SilStoresService,
        SilDatatableService,
        AuthenticationService,
        StepperService,
    ],
})
export class SettingsModule {}
