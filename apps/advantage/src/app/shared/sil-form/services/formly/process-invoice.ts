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
export class ProcessInvoiceService {
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
                props: {
                    template: `
            <div
            class="mt-0 mb-4 p-4"
            style="background-color: rgb(254,236,233); border-radius: 20px">
                <div class="d-flex justify-content-center align-items-center">
                    <div>
                        <img
                            src="../../assets/images/red-warning.svg"
                            height="50" />
                    </div>
                    <div class="ms-3 mt-2">
                        <p class="fs-10 fw-medium" style="color: rgb(240,42,11)">
                            The invoice you have chosen to process has a pending balance of Ksh 4,000. Are you sure you want to process it?
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
