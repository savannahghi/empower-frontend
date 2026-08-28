import { Injectable } from '@angular/core';

/**
 * Allows service to be injectable into formly commponent
 */
@Injectable({
    providedIn: 'root',
})

/** Class that definesform controls */
export class AddPhotoFormService {
    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Stores the form model data
     */
    model: Object;

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'title',
                type: 'input',
                className: 'col-12',
                props: {
                    placeholder: 'Enter the title of the photo e.g KRA PIN',
                    label: 'Photo Title',
                    required: true,
                },
            },
            {
                key: 'photo',
                type: 'file',
                className: 'col-12',
                props: {
                    placeholder: 'Upload Photo',
                    label: 'Upload Photo',
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
