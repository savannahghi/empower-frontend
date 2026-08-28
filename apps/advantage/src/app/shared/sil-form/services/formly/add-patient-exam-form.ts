import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';

@Injectable({
    providedIn: 'root',
})
export class AddPatientGeneralExamService {
    /**
     * Stores form data from api
     */
    model: Object;

    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;

    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Imports datalayer for service calls
     */
    constructor(public dataLayer: SilStoresService) {}
    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                className: 'width-100p mb-4 col-12',
                fieldGroup: [
                    {
                        key: 'fever',
                        type: 'checkbox',
                        className: 'col-6 col-sm-3',
                        props: {
                            label: 'Patient has fever',
                            required: false,
                        },
                    },
                    {
                        key: 'headache',
                        type: 'checkbox',
                        className: 'col-6 col-sm-3',
                        props: {
                            label: 'Patient has a headache',
                            required: false,
                        },
                    },
                    {
                        key: 'stomach_ache',
                        type: 'checkbox',
                        className: 'col-6 col-sm-3',
                        props: {
                            label: 'Patient has stomach ache',
                            required: false,
                        },
                    },
                    {
                        key: 'fatigue',
                        type: 'checkbox',
                        className: 'col-6 col-sm-3',
                        props: {
                            label: 'Patient experiencing fatigue',
                            required: false,
                        },
                    },
                ],
            },
            {
                className: 'width-100p mb-4',
                fieldGroup: [
                    {
                        key: 'weight_status',
                        type: 'radio',
                        className: 'col-12 my-3',
                        props: {
                            label: 'Weight Status',
                            inline: true,
                            required: true,
                            bindValue: 'value',
                            className: `col-12 col-sm-6 pe-sm-3`,
                            options: [
                                {
                                    label: 'Weight loss',
                                    value: 'weight_loss',
                                },
                                {
                                    label: 'Weight gain',
                                    value: 'weight_gain',
                                },
                            ],
                        },
                    },
                    {
                        key: 'decription',
                        type: 'textarea',
                        className: 'col-12 col-sm-12 pe-sm-1',
                        props: {
                            placeholder: 'The patient has mild fever',
                            label: 'Description',
                            rows: 4,
                        },
                    },
                ],
            },
        ];
    }

    setComponent(component) {
        this.component = component;
    }
}
