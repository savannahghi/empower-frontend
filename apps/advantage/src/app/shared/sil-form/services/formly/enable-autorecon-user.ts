import { Injectable } from '@angular/core';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines add transfer item form controls, methods
 */
export class EnableAutoreconUserService {
    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */

    fields() {
        return [
            {
                key: 'template',
                type: 'template',
                className: 'col-12',
                props: {
                    template: `
            <div
            class="mt-2 mb-4 p-4"
            style="background-color: rgba(187, 117, 252, 0.1); border-radius: 20px">
                <div class="d-flex justify-content-start align-items-center">
                    <div>
                        <img
                            src="../../assets/images/warning.svg"
                            height="60" />
                    </div>
                    <div class="ms-4 mt-3">
                        <p class="fs-6 fw-medium mb-0" style="color: rgb(91, 4, 173)">
                            Are you sure you want to enable this business partner to start using AutoRecon?
                        </p>

                    </div>
                </div>  
            </div>`,
                },
            },
        ];
    }

    /**
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}
