import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeaturesModule } from '../../../features.module';
import { ThemeModule } from '../../../../@theme/theme.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxTranslateModule } from '../../../../shared/translate/translate.module';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { PatientService } from '../patient.service';
import { PatientCoverComponent } from './patient-cover.component';
import { SkikaFormModule } from '../../../../shared/sil-form/sil-form.module';
import { SkikaLayoutModule } from '../../../../shared/sil-layout/sil-layout.module';
import {
    NbActionsModule,
    NbAlertModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
} from '@nebular/theme';
import { SilComboBoxModule } from '../../../../shared/sil-combo-box/sil-combo-box.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        NgSelectModule,
        FeaturesModule,
        ThemeModule,
        NbActionsModule,
        NbButtonModule,
        NbCardModule,
        NbCheckboxModule,
        NbDatepickerModule,
        NbIconModule,
        NbInputModule,
        NbSelectModule,
        NbAlertModule,
        NgSelectModule,
        SweetAlert2Module,
        SkikaFormModule,
        SilComboBoxModule,
        SkikaLayoutModule,
        NgxTranslateModule,
        FormsModule,
    ],
    declarations: [PatientCoverComponent],
    exports: [PatientCoverComponent],
    providers: [SilStoresService, PatientService],
})
export class PatientCoverModule {}
