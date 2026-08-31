import { Injectable } from '@angular/core';

export class LicensingService {
    /**
     * Component reference to SilFormComponent
     * @returns fields information
     */
    component: any;

    /**
     * Injectable for the form service
     */
    @Injectable({
        providedIn: 'root',
    })

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'licenses',
                type: 'table',
                className: 'col-12 px-sm-2 pad-t-12',
                props: {
                    label: 'Licenses',
                    btnText: 'Add New License',
                    description: 'Add the licenses tied to your business',
                },
            },
        ];
    }
    setComponent(component) {
        this.component = component;
    }
}
