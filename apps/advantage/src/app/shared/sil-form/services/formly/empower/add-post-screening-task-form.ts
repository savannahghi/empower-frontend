import { Injectable } from '@angular/core';
/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the task addition post screening form service
 */
export class AddPostScreeningService {
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
                key: 'other_reason',
                type: 'textarea',
                className: 'col-12',
                props: {
                    required: true,
                    label: 'Describe an action you performed during the handling of this task',
                    placeholder:
                        'Describe actions taken during the handling of this task',
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
