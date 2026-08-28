import { Injectable } from '@angular/core';

/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})
export class MobileMoneySetupService {
    /**
     * Component reference to SilFormComponent
     * @returns fields information
     */
    component: any;

    /**
     * Stores form data from api
     */
    model: any = {};

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'business_number',
                type: 'input',
                className: 'col-12 col-sm-12 px-sm-2 pad-t-12 width-100p',
                props: {
                    label: 'Business Number',
                    placeholder: 'Enter business number...',
                    required: true,
                },
                expressions: {
                    'model.business_number': field => {
                        if (field?.model?.business_number) {
                            return field?.model?.business_number;
                        }
                    },
                },
            },
            {
                key: 'mobile_money_type',
                type: 'select',
                className: 'col-12 col-sm-12 px-sm-2 pad-t-12 width-100p',
                props: {
                    placeholder: 'Select mobile money type...',
                    label: 'Mobile Money Type',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        { title: 'MPESA', value: 'MPESA' },
                        { title: 'Airtel Money', value: 'Airtel Money' },
                    ],
                    closeOnSelect: true,
                    required: true,
                },
                expressions: {
                    'model.mobile_money_type': field => {
                        if (field?.model?.mobile_money_type) {
                            return field?.model?.mobile_money_type;
                        }
                    },
                },
            },
            {
                key: 'type_description',
                type: 'input',
                className: 'col-12 col-sm-12 px-sm-2 pad-t-12 width-100p',
                props: {
                    label: 'Mobile Money Type Description',
                    placeholder: 'Enter description...',
                },
                expressions: {
                    'model.type_description': field => {
                        if (field?.model?.type_description) {
                            return field?.model?.type_description;
                        }
                    },
                },
            },
        ];
    }

    setComponent(component) {
        this.component = component;
    }
}
