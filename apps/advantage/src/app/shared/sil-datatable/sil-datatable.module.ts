import {
    CUSTOM_ELEMENTS_SCHEMA,
    NgModule,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
import {
    NbLayoutModule,
    NbRadioModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbTreeGridModule,
    NbSpinnerModule,
    NbButtonModule,
    NbCheckboxModule,
    NbTagModule,
    NbFormFieldModule,
    NbTooltipModule,
    NbDatepickerModule,
    NbButtonGroupModule,
} from '@nebular/theme';

import { StackedRowComponent } from './components/stacked-row/stacked-row.component';
import { SilDatatableFiltersComponent } from './components/sil-datatable-filters/sil-datatable-filters.component';
import { SilDatatableSearchComponent } from './components/sil-datatable-search/sil-datatable-search.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SilDatatableComponent } from './components/sil-datatable/sil-datatable.component';
import { SkikaLayoutModule } from '../sil-layout/sil-layout.module';
import { SkikaFormModule } from '../sil-form/sil-form.module';
import { SilDatatableFormFilterComponent } from './components/sil-datatable-form-filter/sil-datatable-form-filter.component';
import { SilStoresService } from '../sil-http-services/sil_datalayer.service';
import { NgPipesModule } from 'ngx-pipes';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxTranslateModule } from '../translate/translate.module';
import { SilCurrencyPipe } from '../../@theme/pipes/currency/currency.pipe';
import { StatusColorPipe } from '../../@theme/pipes/status-color/status-color.pipe';
import { ConsentColorPipe } from '../../@theme/pipes/consent-color/consent-color.pipe';
import { FormatBooleanPipe } from '../../@theme/pipes/format-boolean/format-boolean.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { StringReplacePipe } from '../../@theme/pipes/string-replace/string-replace.pipe';
import { CommonModule } from '@angular/common';
import { SilDataViewComponent } from './components/sil-data-view/sil-data-view.component';
import { DeliveryTypePipe } from '../../@theme/pipes/delivery-type/delivery-type.pipe';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TruncatePipe } from '../../@theme/pipes/truncate/truncate.pipe';
import { CronDisplayPipe } from '../../@theme/pipes/cron-display/cron-display.pipe';
import { ArrayToCommaSeparatedStringPipe } from '../../@theme/pipes/array-to-comma-separated-string/array-to-comma-separated-string.pipe';
import { SilDatatableTagFiltersComponent } from './components/sil-datatable-tag-filters/sil-datatable-tag-filters.component';
import { EntryTypePipe } from '../../@theme/pipes';

@NgModule({
    imports: [
        CommonModule,
        NbButtonModule,
        NbCheckboxModule,
        NbCardModule,
        NbFormFieldModule,
        NbIconModule,
        NbInputModule,
        NbRadioModule,
        NbLayoutModule,
        NbSpinnerModule,
        NbTagModule,
        NbTreeGridModule,
        NbTooltipModule,
        NbButtonGroupModule,
        ReactiveFormsModule,
        NgxSkeletonLoaderModule,
        SkikaFormModule,
        SkikaLayoutModule,
        SilCurrencyPipe,
        NbDatepickerModule,
        ThemeModule,
        ngFormsModule,
        NgPipesModule,
        SweetAlert2Module,
        NgxTranslateModule,
        StatusColorPipe,
        FormatBooleanPipe,
        NgSelectModule,
        StringReplacePipe,
        DeliveryTypePipe,
        ConsentColorPipe,
        TruncatePipe,
        CronDisplayPipe,
        ArrayToCommaSeparatedStringPipe,
        EntryTypePipe,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    declarations: [
        SilDatatableComponent,
        PaginationComponent,
        StackedRowComponent,
        SilDatatableSearchComponent,
        SilDatatableFiltersComponent,
        SilDataViewComponent,
        SilDatatableFormFilterComponent,
        SilDatatableTagFiltersComponent,
    ],
    exports: [
        SilDatatableComponent,
        PaginationComponent,
        StackedRowComponent,
        SilDatatableSearchComponent,
        SilDatatableFiltersComponent,
    ],
    providers: [SilStoresService],
})
export class SilDatatableModule {}
