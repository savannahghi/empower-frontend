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
export class ProcessBomOperationService {
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
            class="mt-2 mb-4 p-4"
            style="background-color: rgba(187, 117, 252, 0.1); border-radius: 20px">
                <div class="d-flex justify-content-center align-items-center">
                    <div>
                        <img
                            src="../../assets/images/warning.svg"
                            height="50" />
                    </div>
                    <div class="ms-3 mt-3">
                        <p class="fs-10 fw-medium" style="color: rgb(91, 4, 173)">
                            By processing this operation, you will automatically add the added quantity of 
                            the assembled item into your inventory, and deduct the component items from your inventory. 
                            Would you like to proceed?
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
