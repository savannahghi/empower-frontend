import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { SilDocumentDialogueComponent } from './sil-document-dialogue.component';
import { PatientService } from '../../features/advantage/patients/patient.service';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SkikaLayoutModule } from '../sil-layout/sil-layout.module';
import { SkikaFormModule } from '../sil-form/sil-form.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FeaturesModule } from '../../features/features.module';
import {
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbIconModule,
    NbInputModule,
    NbRadioModule,
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
    NbTagModule,
} from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { NgPipesModule } from 'ngx-pipes';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
@NgModule({
    imports: [
        CommonModule,
        NbInputModule,
        NbCardModule,
        NbButtonModule,
        NbActionsModule,
        NbUserModule,
        NbCheckboxModule,
        NbRadioModule,
        NbDatepickerModule,
        NbSelectModule,
        NbIconModule,
        NbListModule,
        NbThemeModule,
        NbTabsetModule,
        NbSpinnerModule,
        NbToastrModule,
        NbAlertModule,
        NbAccordionModule,
        NbTagModule,
        NbTooltipModule,
        NgPipesModule,
        SkikaLayoutModule,
        SkikaFormModule,
        SweetAlert2Module,
        ThemeModule,
        FeaturesModule,
        NgxSkeletonLoaderModule,
        NgxExtendedPdfViewerModule,
        FormsModule,
    ],
    declarations: [SilDocumentDialogueComponent],
    exports: [SilDocumentDialogueComponent],
    providers: [PatientService],
})
export class SilDocumentDialogueModule {}
