import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeaturesModule } from '../../../features/features.module';
import { ThemeModule } from '../../../@theme/theme.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxTranslateModule } from '../../translate/translate.module';
import { SilStoresService } from '../../sil-http-services/sil_datalayer.service';
import { PatientService } from '../../../features/advantage/patients/patient.service';
import { StartVisitComponent } from './start-visit.component';
import { SkikaFormModule } from '../../../shared/sil-form/sil-form.module';
import { SkikaLayoutModule } from '../../sil-layout/sil-layout.module';
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
import { SilComboBoxModule } from '../../sil-combo-box/sil-combo-box.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
        ReactiveFormsModule,
    ],
    declarations: [StartVisitComponent],
    exports: [StartVisitComponent],
    providers: [SilStoresService, PatientService],
})
export class StartVisitModule {}
