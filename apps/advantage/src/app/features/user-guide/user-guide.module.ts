import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from 'app/@core/auth/services/authentication.service';
import { UIRouterModule } from '@uirouter/angular';
import { UserGuideComponent } from './guide/user-guide.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import {
    NbCardModule,
    NbToastrModule,
    NbTooltipModule,
    NbUserModule,
    NbLayoutModule,
    NbButtonModule,
    NbSpinnerModule,
    NbStepperModule,
} from '@nebular/theme';
import { USER_GUIDE_STATES } from './user-guide.state';
import { UserGuideDetailsComponent } from './guide-details/user-guide-details.component';
import { FeaturesModule } from '../features.module';
import { SafeUrlPipe } from 'app/@theme/pipes/safe-url/safe-url.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { SkikaFormModule } from 'app/shared/sil-form/sil-form.module';
import { SilDatatableService } from 'app/shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { SkikaLayoutModule } from 'app/shared/sil-layout/sil-layout.module';
import { SilDatatableModule } from 'app/shared/sil-datatable/sil-datatable.module';
@NgModule({
    imports: [
        CommonModule,
        UIRouterModule.forChild({ states: USER_GUIDE_STATES }),
        NbCardModule,
        NbToastrModule,
        NbTooltipModule,
        NbUserModule,
        NbLayoutModule,
        FeaturesModule,
        TranslateModule,
        NbButtonModule,
        NbSpinnerModule,
        SkikaFormModule,
        NgxSkeletonLoaderModule,
        NbStepperModule,
        SilDatatableModule,
        SkikaLayoutModule,
    ],
    declarations: [UserGuideComponent, UserGuideDetailsComponent, SafeUrlPipe],
    providers: [SilStoresService, AuthenticationService, SilDatatableService],
    exports: [UserGuideDetailsComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserGuideModule {}
