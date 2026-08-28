import { Injectable } from '@angular/core';
/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the unfulfilled task post screening service
 */
export class UnfullfilledTaskPostScreeningService {
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
                            label: 'Unable to reach patient or facility',
                            value: 'Unable to reach patient or facility',
                            key: 'Unable to reach patient or facility',
                        },
                        {
                            label: 'Patient has financial constraints',
                            value: 'Patient has financial constraints',
                            key: 'Patient has financial constraints',
                        },
                        {
                            label: 'Patient has transportation issues',
                            value: 'Patient has transportation issues',
                            key: 'Patient has transportation issues',
                        },
                        {
                            label: 'Patient was attended to elsewhere',
                            value: 'Patient was attended to elsewhere',
                            key: 'Patient was attended to elsewhere',
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
                    placeholder:
                        'Enter another reason for marking the task as unfulfilled',
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
