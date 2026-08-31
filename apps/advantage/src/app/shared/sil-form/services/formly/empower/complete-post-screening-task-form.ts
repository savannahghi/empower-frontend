import { Injectable } from '@angular/core';
/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the task completion form service
 */
export class CompletePostScreeningFieldsService {
    /**
     * Component reference to SilFormComponent
     * @returns fields information
     */
    component: any;

    /**
     * Stores form data from api
     */
    model: Object;

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'returned_results_task',
                type: 'radio',
                className: 'col-12 ms-0 pb-2',
                expressions: {
                    'model.returned_results_task': field => {
                        field.props.model = field.model?.returned_results_task;
                        return field.model?.returned_results_task;
                    },
                },
                templateOptions: {
                    type: 'radio',
                    label: '',
                    name: 'returned_results_task',
                    className: `col`,
                    options: [
                        {
                            label: 'Patient returned with test results',
                            value: 'Patient returned with test results',
                            key: 'Patient returned with test results',
                        },
                        {
                            label: 'Test results uploaded and appointment booked',
                            value: 'Test results uploaded and appointment booked',
                            key: 'Test results uploaded and appointment booked',
                        },
                        {
                            label: 'Other',
                            value: 'Other',
                            key: 'Other',
                        },
                    ],
                },
            },
            {
                key: 'other_reason',
                type: 'textarea',
                className: 'col-12',
                hideExpression: 'model.returned_results_task !== "Other"',
                expressions: {
                    'model.other_reason': field => {
                        field.props.model = field.model?.other_reason;
                        return field.model?.other_reason;
                    },
                },
                props: {
                    placeholder: 'Enter another reason for completing the task',
                    rows: 4,
                },
            },
        ];
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}
