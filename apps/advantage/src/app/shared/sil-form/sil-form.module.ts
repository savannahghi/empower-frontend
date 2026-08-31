import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import { provideEnvironmentNgxMask, NgxMaskDirective } from 'ngx-mask';
import {
    provideHttpClient,
    withInterceptorsFromDi,
    withJsonpSupport,
} from '@angular/common/http';
/**
 * - Bootstrap import {FormlyBoostrapModule} from '@ngx-formly/bootstrap'
 */
import { ThemeModule } from '../../@theme/theme.module';
import {
    NbLayoutModule,
    NbRouteTabsetModule,
    NbTooltipModule,
    NbButtonModule,
    NbInputModule,
    NbDatepickerModule,
    NbCheckboxModule,
    NbCardModule,
    NbSpinnerModule,
    NbTabsetModule,
    NbRadioModule,
    NbButtonGroupModule,
    NbIconModule,
} from '@nebular/theme';
import { NbMomentDateModule } from '@nebular/moment';

import { prepopulateExtension } from './services/formly_extensions/prepopulate.extension';
import { NgSelectModule } from '@ng-select/ng-select';
import { SkikaLayoutModule } from '../sil-layout/sil-layout.module';

import { SkikaSafePipe } from '../sil-pipes/skika-safety.pipe';

import { SilFormlyService } from './services/skika-formly-service';
import { EditPricelistDetailsFormService } from './services/formly/edit-pricelist-details-form';
import { SkikaSaveOnChangesService } from './services/skika-save-onchanges.service';
import { PatientRegistrationService } from './services/formly/patient-registration-form';
import { PractitionerRegistrationService } from './services/formly/practitioner-registration-form';
import { NextofKinRegistrationService } from './services/formly/next-of-kin-registration-form';
import { AppointmentFieldsService } from './services/formly/add-appointment-form';
import { BulkCancelAppointmentService } from './services/formly/bulk-cancel-appointments';
import { FilterAppointmentsService } from './services/formly/filter-appointments-form';
import { BillItemFieldsService } from './services/formly/add-bill-item-form';
import { AddPatientPaymentFieldsService } from './services/formly/add-patient-payment';
import { PatientVitalFieldsService } from './services/formly/add-patient-vitals-form';
import { PatientProblemFieldsService } from './services/formly/add-patient-problem-form';
import { PatientDiagnosisFieldsService } from './services/formly/add-patient-diagnosis-form';
import { PatientCompositionFieldsService } from './services/formly/add-patient-composition-form';
import { PatientAttachmentFieldsService } from './services/formly/add-attachment-form';
import { AddMessageTemplateService } from './services/formly/add-message-template-form';
import { ProviderFieldsService } from './services/formly/basic-provider-form';
import { SilFormComponent } from './components/sil-form/sil-form.component';
import { SilInputComponent } from './components/sil-input/sil-input.component';
import { SilFormSelectComponent } from './components/sil-select/sil-select.component';
import { SilFormCheckboxComponent } from './components/sil-checkbox/sil-checkbox.component';
import { SilFormDatepickerComponent } from './components/sil-datepicker/sil-datepicker.component';
import { SilFormTextareaComponent } from './components/sil-textarea/sil-textarea.component';
import { SilFormCoordinatesComponent } from './components/sil-coordinates/sil-coordinates.component';
import { RepeatTypeComponent } from './components/repeat-type/repeat-type.component';
import { FormlyFieldFileComponent } from './components/file-type/file-type.component';
import { SilFormTemplateComponent } from './components/sil-form-template/sil-form-template.component';
import { SilRadioComponent } from './components/sil-radio/sil-radio.component';
import { SilButtonGroupComponent } from './components/sil-button-group/sil-button-group.component';
import { SilFormActionComponent } from './components/sil-form-action/sil-form-action.component';
import { PatientAllergyFieldsService } from './services/formly/add-patient-allergy-form';
import { DiseaseRegistrationService } from './services/formly/disease-registration-form';
import { checkinFieldService } from './services/formly/add-checkin-form';
import { OperatingRegionsService } from './services/formly/add-operating-regions-form';
import { FacilityServiceFormService } from './services/formly/facility-service-form';
import { PriceListFieldsService } from './services/formly/add-pricelist-form';
import { ProductFieldsService } from './services/formly/add-product-form';
import { SilFormComboboxComponent } from './components/sil-combobox/sil-combobox.component';
import { SilFormCkEditorComponent } from './components/sil-ckeditor/sil-ckeditor.component';
import { SilCurrencyPipe } from '../../@theme/pipes/currency/currency.pipe';
import { SilPhoneNumberComponent } from './components/sil-phone-number/sil-phone-number.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SilPhoneCountryCodePipe } from '../../@theme/pipes/phone-number-country-code/phone-number-country-code.pipe';
import { SilFormDateTimepickerComponent } from './components/sil-datetimepicker/sil-datetimepicker.component';
import { SilFormTableComponent } from './components/sil-form-table/sil-form-table.component';
import { BusinessDetailsRegistrationService } from './services/formly/business-details-form';
import { PayerRegistrationService } from './services/formly/payer-registration-form';
import { LicensingService } from './services/formly/payer-licensing-form';
import { EmployerRegistrationService } from './services/formly/employer-registration-form';
import { BusinessDocumentsUploadService } from './services/formly/upload-business-documents-form';
import { FormlyCustomRadioComponent } from './components/sil-custom-radio/custom-radio.component';
import { EditSegmentMessageService } from './services/formly/edit-segment-message-form';
import { ClusterOrganisationUnitService } from './services/formly/cluster-org-unit.form';
import { FilterReconinvoicesService } from './services/formly/filter-reconinvoices-form';
import { SilFileUploaderComponent } from './components/sil-file-uploader/sil-file-uploader.component';
import { FileExtensionPipe } from '../../@theme/pipes/file-extension/file-extension.pipe';
import { MinimalPatientRegistrationFormFieldsService } from './services/formly/minimal-patient-registration-form';

@NgModule({
    declarations: [
        FormlyFieldFileComponent,
        RepeatTypeComponent,
        SilButtonGroupComponent,
        SilFormComponent,
        SilFormCheckboxComponent,
        SilFormCoordinatesComponent,
        SilFormDatepickerComponent,
        SilFormSelectComponent,
        SilFormTextareaComponent,
        SilFormCkEditorComponent,
        SilFormTemplateComponent,
        SilFormActionComponent,
        SilInputComponent,
        SilRadioComponent,
        SkikaSafePipe,
        SilFormComboboxComponent,
        SilPhoneNumberComponent,
        SilFormDateTimepickerComponent,
        SilFormTableComponent,
        FormlyCustomRadioComponent,
        SilFileUploaderComponent,
    ],
    exports: [
        SilFormComponent,
        SilFormCheckboxComponent,
        SilFormDatepickerComponent,
        SilFormTemplateComponent,
        SilFormTextareaComponent,
        SilFormCkEditorComponent,
        SilInputComponent,
        SilFormSelectComponent,
        SilFormCoordinatesComponent,
        RepeatTypeComponent,
        FormlyFieldFileComponent,
        SkikaSafePipe,
        FormlyCustomRadioComponent,
        SilFileUploaderComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        FormlyModule.forRoot({
            extras: { checkExpressionOn: 'modelChange' },
            types: [
                { name: 'input', component: SilInputComponent },
                { name: 'buttongroup', component: SilButtonGroupComponent },
                { name: 'checkbox', component: SilFormCheckboxComponent },
                { name: 'phonenumber', component: SilPhoneNumberComponent },
                { name: 'template', component: SilFormTemplateComponent },
                { name: 'datepicker', component: SilFormDatepickerComponent },
                {
                    name: 'datetimepicker',
                    component: SilFormDateTimepickerComponent,
                },
                { name: 'textarea', component: SilFormTextareaComponent },
                { name: 'select', component: SilFormSelectComponent },
                { name: 'ckeditor', component: SilFormCkEditorComponent },
                { name: 'combobox', component: SilFormComboboxComponent },
                {
                    name: 'coordinates',
                    component: SilFormCoordinatesComponent,
                },
                { name: 'repeat', component: RepeatTypeComponent },
                { name: 'file', component: FormlyFieldFileComponent },
                { name: 'radio', component: SilRadioComponent },
                { name: 'formaction', component: SilFormActionComponent },
                { name: 'table', component: SilFormTableComponent },
                { name: 'custom-radio', component: FormlyCustomRadioComponent },
                { name: 'array', component: null },
            ],
            validationMessages: [
                { name: 'required', message: 'This field is required' },
                { name: 'minLength', message: 'This field is too short' },
                { name: 'maxLength', message: 'This field is too long' },
            ],
            extensions: [
                {
                    name: 'prepopulate-extension',
                    extension: prepopulateExtension,
                },
            ],
        }),
        CKEditorModule,
        GoogleMapsModule,
        NbButtonModule,
        NbIconModule,
        NbButtonGroupModule,
        NbCheckboxModule,
        NbCardModule,
        NbDatepickerModule,
        NbInputModule,
        NbMomentDateModule,
        NbLayoutModule,
        NbRadioModule,
        NbRouteTabsetModule,
        NbSpinnerModule,
        NbTooltipModule,
        NbTabsetModule,
        NgxMaskDirective,
        NgSelectModule,
        SkikaLayoutModule,
        ThemeModule,
        SilCurrencyPipe,
        SilPhoneCountryCodePipe,
        BsDropdownModule.forRoot(),
        NgxIntlTelInputModule,
        NbCardModule,
        FileExtensionPipe,
    ],
    providers: [
        EditPricelistDetailsFormService,
        SilFormlyService,
        SkikaSaveOnChangesService,
        ProviderFieldsService,
        PatientRegistrationService,
        NextofKinRegistrationService,
        BulkCancelAppointmentService,
        AppointmentFieldsService,
        checkinFieldService,
        OperatingRegionsService,
        FilterAppointmentsService,
        FilterReconinvoicesService,
        BillItemFieldsService,
        AddPatientPaymentFieldsService,
        PatientVitalFieldsService,
        PatientProblemFieldsService,
        PatientAllergyFieldsService,
        PatientDiagnosisFieldsService,
        PatientCompositionFieldsService,
        PatientAttachmentFieldsService,
        DiseaseRegistrationService,
        FacilityServiceFormService,
        BusinessDetailsRegistrationService,
        PractitionerRegistrationService,
        AddMessageTemplateService,
        PriceListFieldsService,
        ProductFieldsService,
        BusinessDocumentsUploadService,
        SilCurrencyPipe,
        PayerRegistrationService,
        EmployerRegistrationService,
        LicensingService,
        EditSegmentMessageService,
        ClusterOrganisationUnitService,
        MinimalPatientRegistrationFormFieldsService,
        provideEnvironmentNgxMask(),
        FileExtensionPipe,
        provideHttpClient(withInterceptorsFromDi(), withJsonpSupport()),
    ],
})
export class SkikaFormModule {}
