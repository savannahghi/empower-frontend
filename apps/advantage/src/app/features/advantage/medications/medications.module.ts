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
    NbCheckboxModule,
    NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbUserModule,
    NbListModule,
    NbThemeModule,
} from '@nebular/theme';
import { SilDatatableModule } from '../../../shared/sil-datatable/sil-datatable.module';
import { FeaturesModule } from '../../features.module';
import { SilDatatableService } from '../../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { SkikaLayoutModule } from '../../../shared/sil-layout/sil-layout.module';
import { NgxTranslateModule } from '../../../shared/translate/translate.module';
import { MEDICATIONS_STATES } from './medications.states';

@NgModule({
    imports: [
        UIRouterModule.forChild({ states: MEDICATIONS_STATES }),
        CommonModule,
        NbInputModule,
        NbCardModule,
        NbButtonModule,
        NbActionsModule,
        NbCheckboxModule,
        NbUserModule,
        NbRadioModule,
        NbSelectModule,
        NbIconModule,
        NbListModule,
        NbThemeModule,
        SkikaFormModule,
        FeaturesModule,
        SilDatatableModule,
        SkikaLayoutModule,
        NgxTranslateModule,
    ],
    declarations: [],
    providers: [SilStoresService, SilDatatableService, AuthenticationService],
})
export class MedicationsModule {}
