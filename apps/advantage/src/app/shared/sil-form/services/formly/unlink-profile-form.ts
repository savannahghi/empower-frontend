import { Injectable } from '@angular/core';
/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the cancel appointment service
 */
export class UnlinkProfileService {
    /**
     * Component reference to SilFormComponent
     * @returns fields field information
     */
    component: any;

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'reason',
                type: 'textarea',
                className: 'col-12 ',
                props: {
                    label: 'Reason for unlinking',
                    required: true,
                    rows: '5',
                },
            },
        ];
    }

    /**
     * setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}
