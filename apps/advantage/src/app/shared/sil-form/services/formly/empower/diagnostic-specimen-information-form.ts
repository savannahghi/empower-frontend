import { Injectable } from '@angular/core';
import { SilStoresService } from '../../../../sil-http-services/sil_datalayer.service';
import { FormlyFieldConfig } from '@ngx-formly/core';

/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the form breast cancer examination screening service
 */
export class DiagnosticSpecimenInformationService {
    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;
    /**
     * Component reference to SilFormComponent
     * @returns fields information
     */
    component: any;

    /**
     *
     * laterality values
     */
    lateralityValues: Array<any> = [];

    /**
     * speciment type options
     */
    specimenType: Array<any> = [];

    /**
     * speciment type options
     */
    testType: Array<any> = [];

    /**
     * Stores form data from api
     */
    model: any = {};

    /**
     * Imports datalayer for service calls
     * @param dataLayer gives access to the datalayer service
     */
    constructor(public dataLayer: SilStoresService) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                className: 'width-100p',
                fieldGroup: [
                    {
                        key: 'lab_number',
                        type: 'input',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'Lab Number',
                            placeholder: 'Lab Number',
                            required: true,
                            bindLabel: 'value',
                            bindValue: 'value',
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 100,
                            },
                        },
                    },
                    {
                        key: 'date_of_specimen_collection',
                        type: 'datepicker',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'Date Of Specimen Collection',
                            required: true,
                        },
                        modelOptions: {
                            updateOn: 'change',
                            debounce: { default: 10 },
                        },
                    },
                    {
                        key: 'date_of_reporting',
                        type: 'datepicker',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'Date Of Reporting',
                            required: true,
                        },
                        modelOptions: {
                            updateOn: 'change',
                            debounce: { default: 10 },
                        },
                    },
                    {
                        key: 'laterality',
                        type: 'select',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'Laterality',
                            placeholder: 'Select laterality',
                            required: true,
                            bindLabel: 'title',
                            searchable: false,
                            closeOnSelect: true,
                            bindValue: 'value',
                            options: [...this.lateralityValues],
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 100,
                            },
                        },
                    },
                    {
                        key: 'specimen_type',
                        type: 'select',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'Specimen Type',
                            searchable: true,
                            placeholder: 'Select specimen type',
                            required: true,
                            bindLabel: 'title',
                            closeOnSelect: true,
                            bindValue: 'value',
                            options: [...this.specimenType],
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 100,
                            },
                        },
                    },
                    {
                        key: 'test_type',
                        type: 'select',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        defaultValue: 'CBE',
                        props: {
                            label: 'Test Type',
                            placeholder: 'Select test type',
                            required: true,
                            bindLabel: 'title',
                            searchable: true,
                            closeOnSelect: true,
                            bindValue: 'value',
                            options: [...this.testType],
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 100,
                            },
                        },
                    },
                ],
            },
        ];
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;

        this.lateralityValues = [
            {
                title: 'Left',
                value: 'Left',
            },
            {
                title: 'Right',
                value: 'Right',
            },
            {
                title: 'Bilateral',
                value: 'Bilateral',
            },
            {
                title: 'Unknown',
                value: 'Unknown',
            },
        ];

        this.specimenType = [
            {
                title: 'Core Needle Biopsy',
                value: 'Core Needle Biopsy',
            },
            {
                title: 'Excision',
                value: 'Excision',
            },
            {
                title: 'Fine Needle Aspiration (FNA)',
                value: 'Fine Needle Aspiration (FNA)',
            },
            {
                title: 'Incisional Biopsy',
                value: 'Incisional Biopsy',
            },
            {
                title: 'Punch Biopsy',
                value: 'Punch Biopsy',
            },
            {
                title: 'Shave Biopsy',
                value: 'Shave Biopsy',
            },
        ];

        this.testType = [
            {
                title: 'Hematology',
                value: 'Hematology',
            },
            {
                title: 'Cytology',
                value: 'Cytology',
            },
            {
                title: 'Histopathology',
                value: 'Histopathology',
            },
            {
                title: 'Immunohistochemistry (IHC)',
                value: 'Immunohistochemistry (IHC)',
            },
            {
                title: 'Molecular',
                value: 'Molecular',
            },
            {
                title: 'Other',
                value: 'Other',
            },
        ];
    }
}
