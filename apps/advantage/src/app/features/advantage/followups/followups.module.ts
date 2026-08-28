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
    NbIconModule,
    NbInputModule,
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
    NbDatepickerModule,
    NbFormFieldModule,
} from '@nebular/theme';
import { FollowupsListComponent } from './followups-list/followups-list.component';
import { FOLLOWUPS_STATES } from './followups.states';
import { NgSelectModule } from '@ng-select/ng-select';
import { SilComboBoxModule } from '../../../shared/sil-combo-box/sil-combo-box.module';
import { NgxTranslateModule } from '../../../shared/translate/translate.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkikaLayoutModule } from '../../../shared/sil-layout/sil-layout.module';
import { SilDatatableModule } from '../../../shared/sil-datatable/sil-datatable.module';
import { FeaturesModule } from '../../features.module';
import { SilDatatableService } from '../../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { FollowupDetailsComponent } from './followup-details/followup-details.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgPipesModule } from 'ngx-pipes';
import { ThemeModule } from '../../../@theme/theme.module';

@NgModule({
    imports: [
        UIRouterModule.forChild({ states: FOLLOWUPS_STATES }),
        CommonModule,
        NbInputModule,
        NbCardModule,
        NbButtonModule,
        NbActionsModule,
        NbUserModule,
        NbCalendarModule,
        NbTimepickerModule,
        NbCheckboxModule,
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
        NgxSkeletonLoaderModule,
        NgPipesModule,
        ThemeModule,
        NbDatepickerModule,
        NbFormFieldModule,
    ],
    declarations: [FollowupsListComponent, FollowupDetailsComponent],
    providers: [SilStoresService, SilDatatableService, AuthenticationService],
})
export class FollowupsModule {}
