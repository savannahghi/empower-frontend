import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SilComboBoxComponent } from './sil-combo-box.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeaturesModule } from '../../features/features.module';
import { ThemeModule } from '../../@theme/theme.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SilStoresService } from '../sil-http-services/sil_datalayer.service';
import { NgxTranslateModule } from '../translate/translate.module';
import { NbButtonModule } from '@nebular/theme';

@NgModule({
    imports: [
        CommonModule,
        NgSelectModule,
        FeaturesModule,
        ThemeModule,
        SweetAlert2Module,
        NgxTranslateModule,
        NbButtonModule,
    ],
    declarations: [SilComboBoxComponent],
    exports: [SilComboBoxComponent],
    providers: [SilStoresService],
})
export class SilComboBoxModule {}
