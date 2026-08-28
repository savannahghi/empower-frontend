import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import moment from 'moment';
import { MessageLogDetailsModel } from '../../../../features/advantage/models';

/**
 * Allows service to be injectable into formly commponent
 */
@Injectable({
    providedIn: 'root',
})

/** Class that definesform controls */
export class MsgLogDetailsService {
    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Stores the form model data
     */
    model: Object;

    constructor(private sanitizer: DomSanitizer) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                className: 'ms-1 mb-2 col-6 w-100',
                key: 'message',
                expressionProperties: {
                    template: (control: MessageLogDetailsModel) => {
                        const message = `
                            <div class="text-start text-secondary my-4">
                                ${control?.message ?? 'N/A'}
                            </div>
                        `;
                        return this.sanitizeHtml(`
                            <div>
                              ${message}
                              ${this.timeSentOrReceived(control)}
                            </div>
                          `);
                    },
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

    timeSentOrReceived(control: MessageLogDetailsModel) {
        if (control?.delivery_type === 'INBOUND') {
            return `
                    <div class="d-flex flex-row gap-4">
                        <div>
                            <span class="text-dark me-1">Received on: </span> 
                            <span class="fw-bold" style="color: rgba(96, 58, 139, 1)">${this.formatDate(
                                control?.created
                            )}</span> 
                        </div>
                        <div>
                            <span class="text-dark me-1">Received from: </span> 
                            <span class="fw-bold" style="color: rgba(96, 58, 139, 1)">${
                                control?.from_field
                            }</span> 
                        </div>
                    </div>
                `;
        } else {
            return `
                    <div class="d-flex flex-row gap-4">
                        <div>
                            <span class="text-dark me-1">Sent on: </span>
                            <span class="fw-bold" style="color: rgba(96, 58, 139, 1)">${this.formatDate(
                                control?.created
                            )}</span>
                        </div>
                        <div>
                            <span class="text-dark me-1">Sender ID: </span>
                            <span
                            style="color: rgba(96, 58, 139, 1)"
                            class="fw-bold" style="color: rgba(96, 58, 139, 1)">${
                                control?.from_field
                            }</span>
                        </div>
                    </div>
                `;
        }
    }

    formatDate(date: string) {
        return moment(date).format('Do MMMM YYYY [at] h:mmA');
    }

    sanitizeHtml(content: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }
}
