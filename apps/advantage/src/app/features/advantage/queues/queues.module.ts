import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../@core/auth/services/authentication.service';
import { QUEUES_STATE } from './queues.states';
import { UIRouterModule } from '@uirouter/angular';
import { SkikaFormModule } from '../../../shared/sil-form/sil-form.module';
import { VisitService } from '../visits/visit.service';
import { NgPipesModule } from 'ngx-pipes';
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
    NbFormFieldModule,
} from '@nebular/theme';
import { SilDatatableModule } from '../../../shared/sil-datatable/sil-datatable.module';
import { FeaturesModule } from '../../features.module';
import { SilDatatableService } from '../../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { SkikaLayoutModule } from '../../../shared/sil-layout/sil-layout.module';
import { ThemeModule } from '../../../@theme/theme.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { QueueListComponent } from './queue-list/queue-list.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SilComboBoxModule } from '../../../shared/sil-combo-box/sil-combo-box.module';
import { QueueSetupComponent } from './queue-setup/queue-setup.component';
import { NgxTranslateModule } from '../../../shared/translate/translate.module';
import { QueueWorklistComponent } from './queue-worklist/queue-worklist.component';
import { ServiceRequestListItemComponent } from '../service-requests/service-request-list-item/service-request-list-item.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        UIRouterModule.forChild({ states: QUEUES_STATE }),
        CommonModule,
        FeaturesModule,
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
        NbTabsetModule,
        NbSpinnerModule,
        NgPipesModule,
        NbTagModule,
        NbToastrModule,
        NbAlertModule,
        NbAccordionModule,
        NbFormFieldModule,
        NbTooltipModule,
        NgxSkeletonLoaderModule,
        SilDatatableModule,
        SkikaFormModule,
        FormsModule,
        SkikaLayoutModule,
        SweetAlert2Module,
        ThemeModule,
        SilComboBoxModule,
        NgxTranslateModule,
        ServiceRequestListItemComponent,
    ],
    declarations: [
        QueueListComponent,
        QueueSetupComponent,
        QueueWorklistComponent,
    ],
    providers: [
        SilStoresService,
        SilDatatableService,
        AuthenticationService,
        VisitService,
    ],
})
export class QueuesModule {}
