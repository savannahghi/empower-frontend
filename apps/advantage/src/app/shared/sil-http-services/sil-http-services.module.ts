import { NgModule } from '@angular/core';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

import { Oauth2Service } from '../../@core/auth/services/oauth2.service';
import { CompleteService } from '../../@core/auth/services/login.service';
import { DataLayerUtils } from '../../@core/auth/services/datalayer.utils.service';
import { Authorization } from '../../@core/auth/services/authorization.service';

import { SilStoresService } from './sil_datalayer.service';

@NgModule({
    imports: [],
    providers: [
        SilStoresService,
        Authorization,
        DataLayerUtils,
        CompleteService,
        Oauth2Service,
        provideHttpClient(withInterceptorsFromDi()),
    ],
})
export class SilHttpModule {}
