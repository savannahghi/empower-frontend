import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CommonModule } from '@angular/common';
import { NbCardModule } from '@nebular/theme';
import { UIRouterModule } from '@uirouter/angular';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { SilDatatableService } from 'app/shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { AuthenticationService } from 'app/@core/auth/services/authentication.service';
import { VisitService } from '../visits/visit.service';
import { NgModule } from '@angular/core';
import { ConsultationServiceRequestComponent } from './consultation-service-request/consultation-service-request.component';
import { SERVICE_REQUEST_STATES } from './servicerequest.states';
import { ServiceRequestViewerComponent } from './service-request-viewer/service-request-viewer.component';
import { ServiceRequestListItemComponent } from './service-request-list-item/service-request-list-item.component';
import { VitalsEntryServiceRequestComponent } from './vitals-entry-service-request/vitals-entry-service-request.component';
import { PharmacyServiceRequestComponent } from './pharmacy-service-request/pharmacy-service-request.component';

@NgModule({
    declarations: [],
    imports: [
        UIRouterModule.forChild({ states: SERVICE_REQUEST_STATES }),
        NgxSkeletonLoaderModule,
        NbCardModule,
        CommonModule,
        ConsultationServiceRequestComponent,
        VitalsEntryServiceRequestComponent,
        PharmacyServiceRequestComponent,
        ServiceRequestViewerComponent,
        ServiceRequestListItemComponent,
    ],
    providers: [
        SilStoresService,
        SilDatatableService,
        AuthenticationService,
        VisitService,
    ],
})
export class ServiceRequestModule {}
