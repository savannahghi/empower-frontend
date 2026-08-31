import { Injectable } from '@angular/core';

/**
 * Allows service to be injectable into formly commponent
 */
@Injectable({
    providedIn: 'root',
})

/** Class that definesform controls */
export class MsgDeliveryReasonService {
    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Stores the form model data
     */
    model: Object;

    failureDescription: { [key: string]: string } = {
        BLACKLISTED_SENDER:
            'This occurs if the user has opted out of receiving messages either from the particular sender ID or by blocking all messages when they dial the opt out code.',
        SENDER_ID_NOT_ALLOWED:
            'This means that the wrong sender ID was used in the configuration for this message. Please retry sending the message using a different sender ID.',
    };

    deliveryState: string;

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                className: 'ms-1 mb-2 col-6 w-100',
                key: 'failure-reason',
                hideExpression: () => {
                    return this.deliveryState !== 'FAILED';
                },
                expressionProperties: {
                    template: control => {
                        const failureReasonCode = control?.sms?.failure_reason;
                        let template: string = '';

                        template = `<div>
                                        <div class="text-start text-secondary fw-semibold">
                                            ${
                                                failureReasonCode ||
                                                'TECHNICAL_ERROR'
                                            }
                                        </div>
                                        ${`<div class="text-start mt-4 text-secondary">
                                                ${
                                                    this.failureDescription[
                                                        failureReasonCode
                                                    ] || 'Technical Error'
                                                }
                                            </div>`}
                                    </div>`;
                        return template;
                    },
                },
            },
            {
                className: 'ms-1 mb-2 col-6 w-100',
                key: 'message',
                hideExpression: () => {
                    return this.deliveryState === 'FAILED';
                },
                expressionProperties: {
                    template: control => {
                        /**
                         * Show N/A if no message has been added
                         */
                        const message = control?.sms?.message ?? 'N/A';
                        let template: string = '';

                        template = `${`<div class="text-start mt-4 text-secondary">
                                        ${message}
                                        </div>`}
                                    `;
                        return template;
                    },
                },
            },
        ];
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        /**
         * Access the delivery state from the component modelData field
         */
        this.deliveryState = component?.modelData?.sms?.state;

        this.component = component;
    }
}
