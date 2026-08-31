import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from 'app/@core/auth/services/authentication.service';
import { UIRouterModule } from '@uirouter/angular';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import {
    NbCardModule,
    NbToastrModule,
    NbTooltipModule,
    NbUserModule,
    NbLayoutModule,
    NbButtonModule,
    NbSpinnerModule,
    NbInputModule,
    NbIconModule,
} from '@nebular/theme';
import { DELETE_ACCOUNT_STATES } from './delete-account.state';
import { FeaturesModule } from '../features.module';
import { TranslateModule } from '@ngx-translate/core';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { FormsModule } from '@angular/forms';
import { VariantDisplayPipe } from 'app/@theme/pipes/variant-display/variant-display.pipe';

@NgModule({
    imports: [
        CommonModule,
        UIRouterModule.forChild({ states: DELETE_ACCOUNT_STATES }),
        NbCardModule,
        NbToastrModule,
        NbTooltipModule,
        NbUserModule,
        NbLayoutModule,
        FeaturesModule,
        TranslateModule,
        NbButtonModule,
        NbSpinnerModule,
        NbIconModule,
        NgxSkeletonLoaderModule,
        NbInputModule,
        FormsModule,
        VariantDisplayPipe,
    ],
    declarations: [DeleteAccountComponent],
    providers: [SilStoresService, AuthenticationService],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DeleteAccountModule {}
