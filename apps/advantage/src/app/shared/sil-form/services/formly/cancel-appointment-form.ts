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
export class CancelAppointmentService {
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
                key: 'cancellation_reason',
                type: 'textarea',
                className: 'input-flex-one display-grid pad-t-12',
                props: {
                    label: 'Reason for cancellation',
                    required: true,
                    helpText: `Please note that this is an irreversible action.
                    Clicking on the Save
                    button will cancel the appointment and send an SMS to the patient.`,
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
