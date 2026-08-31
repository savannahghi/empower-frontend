import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition } from '@uirouter/core';
import moment from 'moment';
import _ from 'underscore';
import { environment } from '../../../../../environments/environment';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { VisitService } from '../../../../features/advantage/visits/visit.service';
import { ErrorHandlerService } from '../../../sil-http-services/error-handler';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';

@Injectable({
    providedIn: 'root',
})
export class SilDatatableService {
    user: Object;
    toastErrorTime = 10000;
    toastTime = 7000;
    component: Object;
    model: any;

    /**
     * Constructor used for the DatatableService class
     * @param toastrService Access instance of toastrService from nebular
     * @param errorHandler Access instance of error handler service
     * @param dataLayer Access instance of SilStoresService
     * @param transition Access instance of the TransitionService from uirouter
     * @param authConfig Access instance of the authorization service
     * @param visitService Access instance of the visit service
     * @param $state Access instance of the StateService from uirouter
     */
    constructor(
        private toastrService: NbToastrService,
        public errorHandler: ErrorHandlerService,
        public dataLayer: SilStoresService,
        public transition: Transition,
        public authConfig: Authorization,
        public visitService: VisitService,
        public $state: StateService
    ) {
        this.user = this.authConfig.getUser();
    }

    /**
     * variant of the app
     */
    variant = environment.variant;

    /** Used to display toast */
    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        const message = `${context} successfully`;
        this.toastrService.show(message, msg, { position, status, duration });
    }

    /** Used to setup component instance */
    setupComponent(comp) {
        this.component = comp;
    }

    /** Used to display error toast */
    showErrorToast(position, status, msg, context) {
        const duration = this.toastErrorTime;
        this.toastrService.show(`${context} failed`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * Method used get a nested value
     */
    mineValue(obj, path) {
        if (!path) return obj;
        const properties = path.split('.');
        let current = obj;

        for (let i = 0; i < properties.length; i++) {
            if (!current) {
                return undefined;
            }
            current = current[properties[i]];
        }

        return current;
    }

    /**
     *  Updates patient data
     * */
    patchPatient(row, conf, siltable) {
        if (row.person.date_of_birth) {
            row.person.date_of_birth = moment(row.person.date_of_birth).format(
                'YYYY-MM-DD'
            );
        }

        // Only include expected_delivery_date if variant is uzazisalama

        if (row.person.person_contacts) {
            row.person.person_contacts.forEach(contact => {
                if (contact.contact.startsWith('+254')) {
                    contact.contact = contact.contact;
                } else if (/^\d+$/.test(contact.contact)) {
                    contact.contact = '+254' + contact.contact;
                }
            });
        }
        if (row.person.id_value) {
            row.person.person_ids[0] = {
                id_value: row.person.id_value,
                id_document_type: row.person.id_document_type,
                id: row.person.person_ids[0]?.id,
            };
        }
        row.person.person_photos = [];
        this.dataLayer.update('patients', row.id, row).subscribe({
            next: () => {
                const msg = 'Updated patient details';
                const context = 'Patient Details';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.getData();
                siltable.disableSubmit = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                siltable.disableSubmit = false;
                const msg = 'Failed to update patient details';
                const context = 'Update';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    /**
     *  Updates practitioner data
     * */
    patchPractitioner(row, conf, siltable) {
        if (row.person.person_contacts) {
            row.person.person_contacts.forEach(contact => {
                if (contact.contact.startsWith('+254')) {
                    contact.contact = contact.contact;
                } else if (/^\d+$/.test(contact.contact)) {
                    contact.contact = '+254' + contact.contact;
                }
            });
        }
        row.person.person_ids = [];
        row.person.person_photos = [];
        this.dataLayer.update('practitioners', row.id, row).subscribe({
            next: () => {
                const msg = 'Updated practitioner details';
                const context = 'Practitioner Details';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.getData();
                siltable.disableSubmit = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                siltable.disableSubmit = false;
                const msg = 'Failed to update practitioner details';
                const context = 'Update';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    /**
     *  Updates related person data
     * */
    patchNextOfKin(row, conf, siltable) {
        if (row.date_of_birth) {
            row.date_of_birth = moment(row.date_of_birth).format('YYYY-MM-DD');
        }
        if (row.person_contacts) {
            row.person_contacts.forEach(contact => {
                if (contact.contact?.startsWith('+254')) {
                    contact.contact = contact.contact;
                } else if (/^\d+$/.test(contact.contact)) {
                    contact.contact = '+254' + contact.contact;
                }
            });
        }
        this.dataLayer
            .updateResource('patients', conf.nestedId, conf.view, row)
            .subscribe({
                next: () => {
                    const msg = 'Updated related person details';
                    const context = 'Related person details';
                    this.showToast('bottom-right', 'success', context, msg);
                    siltable.showModal = false;
                    siltable.getData();
                    siltable.disableSubmit = false;
                },
                error: err => {
                    this.errorHandler.handleError(err, this.component);
                    siltable.disableSubmit = false;
                    const msg = 'Failed to update related person details';
                    const context = 'Update';
                    this.showErrorToast('bottom-right', 'danger', msg, context);
                },
            });
    }

    /**
     * remove related person relationship
     */
    removeRelationship(row, conf, siltable) {
        this.dataLayer.remove('person-relationship', row.id).subscribe({
            next: () => {
                const msg = 'Unlinked related person';
                const context = 'Unlinked';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.getData();
                siltable.disableSubmit = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                siltable.disableSubmit = false;
                const msg = 'Failed to unlink related person';
                const context = 'Unlinking';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    /**
     * updates appointment data
     * */
    patchAppointment(row, conf, siltable) {
        const appointmentData = _.pick(row, [
            'appointment_status',
            'reason',
            'slot',
        ]);
        appointmentData['slot'] = row.slot.id;
        appointmentData['start'] = row.slot.start;
        appointmentData['end'] = row.slot.end;
        this.dataLayer
            .update('appointments', row.id, appointmentData)
            .subscribe({
                next: () => {
                    const msg = 'Updated appointment details';
                    const context = 'Appointment Details';
                    this.showToast('bottom-right', 'success', context, msg);
                    siltable.showModal = false;
                    siltable.getData();
                    siltable.disableSubmit = false;
                },
                error: err => {
                    this.errorHandler.handleError(err, this.component);
                    const msg = 'Failed to update appointment details';
                    siltable.disableSubmit = false;
                    const context = 'Update';
                    this.showErrorToast('bottom-right', 'danger', msg, context);
                },
            });
    }

    /**
     * updates check-in appointment status from pending to booked
     * */
    patchCheckinAppointment(row, conf, siltable) {
        const appointmentData = _.pick(row, ['appointment_status', 'start']);
        appointmentData['appointment_status'] = 'BOOKED';
        appointmentData['start'] = moment().format('YYYY-MM-D HH:mm:ss');
        this.dataLayer
            .update('appointments', row.id, appointmentData)
            .subscribe({
                next: () => {
                    const msg = 'Patient moved to the check-in queue';
                    const context = 'Check-in Queue Updated';
                    this.showToast('bottom-right', 'success', context, msg);
                    siltable.showModal = false;
                    const params = {
                        start: moment().format('YYYY-MM-DD'),
                        appointment_status: 'PENDING',
                    };
                    siltable?.setParams(params);
                    siltable.disableSubmit = false;
                },
                error: err => {
                    this.errorHandler.handleError(err, this.component);
                    const msg = 'Failed to update appointment details';
                    siltable.disableSubmit = false;
                    const context = 'Update';
                    this.showErrorToast('bottom-right', 'danger', msg, context);
                },
            });
    }

    /**
     * update bill information
     * */
    patchInvoiceLine(row, conf, siltable) {
        this.dataLayer.update('billable-items', row.id, row).subscribe({
            next: () => {
                const msg = 'Updated bill item';
                const context = 'Bill Item';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.disableSubmit = false;
                this.$state.reload();
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                const msg = 'Failed to update bill item line';
                siltable.disableSubmit = false;
                const context = 'Update bill item';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    /**
     * remove bill information
     * */
    removeInvoiceLine(row, conf, siltable) {
        this.dataLayer.remove('billable-items', row.id).subscribe({
            next: () => {
                const msg = 'Removed bill item';
                const context = 'Remove Bill Item';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.disableSubmit = false;
                this.visitService.fetchVisit(siltable['data']['visit']);
                this.$state.reload();
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                const msg = 'Failed to remove bill item line';
                siltable.disableSubmit = false;
                const context = 'Remove bill item';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    /**
     * Remove ReturnOutwardsLine Record
     * */
    removeReturnOutwardsLine(row, conf, siltable) {
        this.dataLayer.remove('return-outwardlines', row.id).subscribe({
            next: () => {
                const msg = 'Removed record item';
                const context = 'Remove Record Item';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.disableSubmit = false;
                this.$state.reload();
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                const msg = 'Failed to remove record item line';
                siltable.disableSubmit = false;
                const context = 'Remove record item';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    /**
     * Remove DirectPurchaseOrderLine Item
     * */
    removeDirectPurchaseOrderLine(row, conf, siltable) {
        this.dataLayer.remove('purchases-orderlines', row.id).subscribe({
            next: () => {
                const msg = 'Removed direct purchase order item';
                const context = 'Remove Direct Purchase Order Line';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.disableSubmit = false;
                this.$state.reload();
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                const msg = 'Failed to direct purchase order item line';
                siltable.disableSubmit = false;
                const context = 'Remove purchase order item';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    /**
     * refund item from invoice
     * */
    refundInvoiceLine(row, conf, siltable) {
        const refundPayload = {
            invoice: row.invoice,
            kra_reason_code: row.kra_reason_code,
            reason: row.reason,
            invoice_lines: [
                {
                    id: row.id,
                    quantity: row.quantity,
                    amount: row.price,
                },
            ],
        };
        /** Create refund */
        this.dataLayer
            .createNested(
                'invoice-transactions',
                'refund_line',
                row.invoice,
                refundPayload
            )
            .subscribe({
                next: (data: any) => {
                    const msg = 'Refund bill item';
                    const context = 'Refund Bill Item';
                    this.showToast('bottom-right', 'success', context, msg);
                    siltable.showModal = false;
                    siltable.disableSubmit = false;
                    siltable.customFxn.emit(data);
                },
                error: err => {
                    this.errorHandler.handleError(err, this.component);
                    const msg = 'Failed to refund bill item line';
                    siltable.disableSubmit = false;
                    const context = 'Refund bill item';
                    this.showErrorToast('bottom-right', 'danger', msg, context);
                },
            });
    }

    // Separate method to create the refund
    createRefund(refundPayload, siltable) {
        this.dataLayer
            .createNested(
                'invoice-transactions',
                'refund',
                refundPayload.invoice,
                refundPayload
            )
            .subscribe(
                data => {
                    const msg = 'Refund bill item';
                    const context = 'Refund Bill Item';
                    this.showToast('bottom-right', 'success', context, msg);
                    siltable.showModal = false;
                    siltable.disableSubmit = false;
                    siltable.customFxn.emit(data);
                },
                err => {
                    this.errorHandler.handleError(err, this.component);
                    const msg = 'Failed to refund bill item line';
                    siltable.disableSubmit = false;
                    const context = 'Refund bill item';
                    this.showErrorToast('bottom-right', 'danger', msg, context);
                }
            );
    }

    /**
     * refund payment
     * */
    refundPayment(row, conf, siltable) {
        const refundPayload = {
            invoice: row.invoice,
            kra_reason_code: row.kra_reason_code,
            reason: row.reason,
            invoice_lines: [
                {
                    id: row.id,
                    quantity: row.quantity,
                },
            ],
        };
        this.dataLayer
            .createNested(
                'invoice-transactions',
                'refund_payment',
                row.invoice,
                row,
                refundPayload
            )
            .subscribe({
                next: () => {
                    siltable.showModal = false;
                    siltable.disableSubmit = false;
                    this.visitService.fetchVisit(siltable['data']['visit']);
                    this.$state.reload();
                },
                error: err => {
                    this.errorHandler.handleError(err, this.component);
                    const msg = 'Failed to refund the payment';
                    siltable.disableSubmit = false;
                    const context = 'Refund';
                    this.showErrorToast('bottom-right', 'danger', msg, context);
                },
            });
    }

    /**
     * confirms arrival
     * */
    confirmArrival(row, conf, siltable) {
        const params = _.pick(row, ['appointment_status']);

        params.appointment_status = 'ARRIVED';

        this.dataLayer.update('appointments', row.id, params).subscribe({
            next: () => {
                const confirmArrivalStatus = {
                    appointment_status: 'FULFILLED',
                };
                this.dataLayer
                    .update('appointments', row.id, confirmArrivalStatus)
                    .subscribe({
                        next: () => {
                            const msg = 'Confirmed Arrival';
                            const context = 'Confirm Arrival';
                            this.showToast(
                                'bottom-right',
                                'success',
                                context,
                                msg
                            );
                            siltable.showModal = false;
                            siltable.getData();
                        },
                        error: err => {
                            this.errorHandler.handleError(err, this);
                        },
                    });
            },
            error: (err: any) => {
                this.errorHandler.handleError(err, this.component);
                const msg = 'Failed to confirm arrival';
                const context = 'Confirm Arrival';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    /**
     * marks appointment as fulfilled
     * */
    markFulfilled(row, conf, siltable) {
        const params = _.pick(row, ['appointment_status']);

        this.dataLayer.update('appointments', row.id, params).subscribe({
            next: () => {
                const fulfillmentStatus = {
                    appointment_status: 'FULFILLED',
                };
                this.dataLayer
                    .update('appointments', row.id, fulfillmentStatus)
                    .subscribe({
                        next: () => {
                            const msg = 'Marked appointment as fulfilled';
                            const context = 'Mark As Fulfilled';
                            this.showToast(
                                'bottom-right',
                                'success',
                                context,
                                msg
                            );
                            siltable.showModal = false;
                            siltable.getData();
                        },
                        error: err => {
                            this.errorHandler.handleError(err, this);
                        },
                    });
            },
            error: (err: any) => {
                this.errorHandler.handleError(err, this.component);
                const msg = 'Failed to mark appointment as fulfilled';
                const context = 'Mark As Fulfilled';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    /**
     * cancels appointment
     * */
    cancelAppointment(row, conf, siltable) {
        const cancelAppointmentData = _.pick(row, [
            'appointment_status',
            'cancellation_reason',
        ]);
        cancelAppointmentData.appointment_status = 'CANCELLED';
        this.dataLayer
            .update('appointments', row.id, cancelAppointmentData)
            .subscribe({
                next: () => {
                    const msg = 'Cancelled appointment';
                    const context = 'Cancelled Appointment';
                    this.showToast('bottom-right', 'success', context, msg);
                    siltable.showModal = false;
                    siltable.getData();
                    siltable.disableSubmit = false;
                },
                error: err => {
                    this.errorHandler.handleError(err, this.component);
                    const msg = 'Failed to cancel appointment';
                    const context = 'Cancel';
                    this.showErrorToast('bottom-right', 'danger', msg, context);
                },
            });
    }

    /**
     * should patch the record
     * */
    genericPatch(row, conf, siltable) {
        if (conf.convertDates) {
            for (let index = 0; index < conf.convertDates.length; index++) {
                const convert = conf.convertDates[index];
                for (let i = 0; i < convert.fields.length; i++) {
                    const field = convert.fields[i];
                    row[field] = moment(row[field])
                        .utc()
                        .format(convert.format);
                }
            }
        }
        const patchObj = conf.patchObject ? conf.patchObject : row;
        this.dataLayer[conf.httpMethod](conf.api, row.id, patchObj).subscribe(
            () => {
                this.showToast(
                    'bottom-right',
                    'success',
                    conf.successTitle,
                    conf.successMessage
                );
                siltable.showModal = false;
                siltable.getData();
                siltable.disableSubmit = false;
                setTimeout(() => {
                    this.$state.reload();
                }, 500);
            },
            err => {
                this.errorHandler.handleError(err.error, this.component);
                const msg = conf.failedMessage;
                const context = conf.failedTitle;
                this.showErrorToast('bottom-right', 'danger', msg, context);
            }
        );
    }

    /**
     * Activate/Retire/Reactivate a doucment
     */
    transitionStatus(row, conf, siltable) {
        const statusLabels = {
            ACTIVE: {
                context: 'Retire',
                status: 'success',
                statusData: 'RETIRED',
            },
            DRAFT: {
                context: 'Activate',
                status: 'success',
                statusData: 'ACTIVE',
            },
            RETIRED: {
                context: 'Reactivate',
                status: 'success',
                statusData: 'ACTIVE',
            },
        };

        const status = row.status;
        const statusObject = statusLabels[status];

        const url = `${row.id}/transition/${statusObject.statusData}`;

        this.dataLayer.update(conf.store, url, {}).subscribe({
            next: () => {
                const context = `${conf.title} successfully ${statusObject.context}d`;
                this.showToast(
                    'bottom-right',
                    statusObject.status,
                    context,
                    `${conf.title} ${statusObject.context}d`
                );
                siltable.getData();
            },
            error: err => {
                this.errorHandler.handleError(err.error, this.component);
                const msg = conf.failedMessage;
                const context = conf.failedTitle;
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    /**
     * should patch the product / service
     */
    updateProductPatch(row, conf, siltable) {
        if (conf.convertDates) {
            for (let index = 0; index < conf.convertDates.length; index++) {
                const convert = conf.convertDates[index];
                for (let i = 0; i < convert.fields.length; i++) {
                    const field = convert.fields[i];
                    row[field] = moment(row[field])
                        .utc()
                        .format(convert.format);
                }
            }
        }

        // Ensure categories, purchase_taxes, and sale_taxes are arrays
        if (typeof row.categories === 'string') {
            row.categories = [row?.categories];
        }

        if (typeof Array.isArray(row.categories)) {
            const categoriesCopy = [...row?.categories];
            row.categories = [];

            for (const categoryItem of categoriesCopy) {
                if (typeof categoryItem === 'string') {
                    row.categories.push(categoryItem);
                } else {
                    /**
                     * category is an object with id
                     */
                    row.categories.push(categoryItem.id);
                }
            }
        }
        if (typeof row.purchase_taxes === 'string') {
            row.purchase_taxes = [row.purchase_taxes];
        }
        if (typeof row.sale_taxes === 'string') {
            row.sale_taxes = [row.sale_taxes];
        }

        // Ensure metadata is not null (provide a default value if necessary)
        if (row.metadata === null || row.metadata === undefined) {
            row.metadata = [];
        }

        // Patch the product
        this.dataLayer[conf.httpMethod](conf.api, row.id, row).subscribe(
            () => {
                this.showToast(
                    'bottom-right',
                    'success',
                    conf.successTitle,
                    conf.successMessage
                );
                siltable.showModal = false;
                siltable.getData();
                siltable.disableSubmit = false;
            },
            err => {
                this.errorHandler.handleError(err.error, this.component);
                const msg = conf.failedMessage;
                const context = conf.failedTitle;
                this.showErrorToast('bottom-right', 'danger', msg, context);
            }
        );
    }

    /**
     * updates segmentation member status
     * */
    patchSegmentMember(row, conf, siltable) {
        const url = `${row?.id}/transition/${conf.status}`;

        this.dataLayer.update('patient-segments', url, {}).subscribe({
            next: () => {
                const msg = 'Member Status activated';
                const context = 'Segment member updated';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.getData();
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                const msg = 'Failed to update member details';
                const context = 'Update';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    /**
     * should patch the record
     * */
    updateFollowUp(row, conf, siltable) {
        const data = Object.assign({
            status: conf?.data?.status,
            updateReason: row.returned_results_task,
            dueDate: row?.node?.dueDate,
            notes: row.other_reason,
        });
        this.dataLayer
            .update('clinical-task', row?.node?.id, data, null, true)
            .subscribe({
                next: () => {
                    this.showToast(
                        'bottom-right',
                        'success',
                        'Successful',
                        `Task has been completed`
                    );
                    siltable.showModal = false;
                    siltable.disableSubmit = false;
                    siltable.getData();
                },
                error: err => {
                    this.showToast(
                        'bottom-right',
                        'danger',
                        'Error',
                        err?.error?.message
                    );
                    siltable.disableSubmit = false;
                },
            });
    }

    /**
     * should patch the record
     * */
    genericNestedPatch(row, conf, siltable) {
        this.dataLayer[conf.httpMethod](
            conf.api,
            row.id,
            conf.view,
            row
        ).subscribe(
            () => {
                this.showToast(
                    'bottom-right',
                    'success',
                    conf.successTitle,
                    conf.successMessage
                );
                siltable.showModal = false;
                siltable.getData();
                siltable.disableSubmit = false;
            },
            err => {
                this.errorHandler.handleError(err.error, this.component);
                const msg = conf.failedMessage;
                const context = conf.failedTitle;
                this.showErrorToast('bottom-right', 'danger', msg, context);
            }
        );
    }

    // refresh data
    refreshData(conf) {
        const id = this.transition.params('id');
        this.dataLayer.get('createProvider', id).subscribe({
            next: (response: any) => {
                this.component['apilist'] = response[conf.dataObj];
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
            },
        });
    }

    /**
     * updates settings data
     * */
    patchOrgSetting(row, conf, siltable) {
        const orgData = _.pick(row, ['value', 'name']);
        if (!isNaN(parseInt(orgData.value, 10))) {
            orgData.value = [parseInt(orgData.value, 10)];
        }
        this.dataLayer.customUpdate('settings', [orgData]).subscribe({
            next: (res: any) => {
                /**
                 * Update existing localtorage org settings to avoid using stale data
                 */
                this.authConfig.setOrganisationSettings(res);
                const msg = 'Updated organisation settings';
                const context = 'Organisation Details';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.getData();
                siltable.disableSubmit = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                const msg = 'Failed to update organisation settings';
                siltable.disableSubmit = false;
                const context = 'Organisation Details';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    /*
     *updates branch settings data
     */
    patchBranchSettings(row, conf, siltable) {
        const branchData = _.pick(row, ['value', 'name']);
        branchData.value = row?.senderid ?? row?.value; // Use senderID value if it exists else use form value
        if (!isNaN(parseInt(branchData.value, 10))) {
            branchData.value = [parseInt(branchData.value, 10)];
        }
        this.dataLayer.customUpdate('branch-settings', [branchData]).subscribe({
            next: () => {
                const msg = 'Updated branch settings';
                const context = 'Organisation Details';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.getData();
                siltable.disableSubmit = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                siltable.disableSubmit = false;
                const msg = 'Failed to update sender-id details';
                const context = 'Update';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    /** add patient to queue method */
    addToQueue(row, conf, siltable) {
        const status = row.status;
        let data: any;
        if (status === 'PENDING') {
            data = { status: 'WAITING' };
        } else {
            data = { status: 'IN_PROGRESS' };
        }
        this.dataLayer.update('service-requests', row.id, data).subscribe({
            next: () => {
                const msg =
                    status === 'PENDING'
                        ? 'The patient has been added to the queue'
                        : 'The patient is ready to be seen';
                this.showToast('bottom-right', 'success', msg, `${msg}`);
                siltable.showModal = false;
                siltable.getData();
                siltable.disableSubmit = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                const msg = 'Failed to add to queue';
                const context = 'Cancel';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    /**
     *  Updates a guideline
     * */
    patchGuidelines(row, conf, siltable) {
        this.dataLayer.update('guidelines', row.id, row).subscribe({
            next: () => {
                const msg = 'Updated guidelines details';
                const context = 'Update Guidelines';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.getData();
                siltable.disableSubmit = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                siltable.disableSubmit = false;
                const msg = 'Failed to update guidelines details';
                const context = 'Update';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    /**
     *  Updates a prompt
     * */
    patchPrompt(row, conf, siltable) {
        this.dataLayer.update('prompts', row.id, row).subscribe({
            next: () => {
                const msg = 'Updated prompts details';
                const context = 'Update Prompts';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.getData();
                siltable.disableSubmit = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                siltable.disableSubmit = false;
                const msg = 'Failed to update guidelines details';
                const context = 'Update';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    /**
     *  Updates a prompt
     * */
    patchQueue(row, conf, siltable) {
        this.dataLayer.update('queues', row.id, row).subscribe({
            next: () => {
                const msg = 'Updated queue details';
                const context = 'Update Queue';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.getData();
                siltable.disableSubmit = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                siltable.disableSubmit = false;
                const msg = 'Failed to update queue details';
                const context = 'Update';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    /**
     *  Updates a disease
     * */
    patchDisease(row, conf, siltable) {
        row.area = row.area.id;
        row.name = row.disease.display_name;
        const clinicalGuidelineIds = [];
        const patientGuidelineIds = [];

        if (row.clinical_guidelines) {
            for (let clinicalGuideline of row.clinical_guidelines) {
                clinicalGuidelineIds.push(
                    (clinicalGuideline = clinicalGuideline.id)
                );
            }
            row.clinical_guidelines = clinicalGuidelineIds;
        }

        if (row.patient_guidelines) {
            for (let patientGuideline of row.patient_guidelines) {
                patientGuidelineIds.push(
                    (patientGuideline = patientGuideline.id)
                );
            }
        }
        row.patient_guidelines = patientGuidelineIds;
        this.dataLayer.update('diseases', row.id, row).subscribe({
            next: () => {
                const msg = 'Updated disease details';
                const context = 'Update Disease';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.getData();
                siltable.disableSubmit = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                siltable.disableSubmit = false;
                const msg = 'Failed to update disease details';
                const context = 'Update';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    /**
     *  Updates a guideline
     * */
    patchPatientGuidelines(row, conf, siltable) {
        this.dataLayer.update('patient-guidelines', row.id, row).subscribe({
            next: () => {
                const msg = 'Updated guidelines details';
                const context = 'Update Guidelines';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.getData();
                siltable.disableSubmit = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                siltable.disableSubmit = false;
                const msg = 'Failed to update guidelines details';
                const context = 'Update';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    // patch data
    patchAnswer(row, conf) {
        const params = { slade_code: this.user['business_partner'] };
        const dataObj = {
            question_id: row.id,
            answer_text: conf.value,
        };
        this.dataLayer
            .customUpdate('onboard-provider', dataObj, params)
            .subscribe({
                next: (response: any) => {
                    this.component['secondaryData'] = response.question_answers;
                },
                error: err => {
                    this.errorHandler.handleError(err, this.component);
                    const msg = 'Failed to save answer';
                    const context = 'Answer';
                    this.showErrorToast('bottom-right', 'danger', msg, context);
                },
            });
    }

    /** Processes store name used for downloading a document */
    processDownloadStoreName(row, actConf) {
        /**
         * check if the content type flag is defined
         * then have logic to determine the store name
         */
        if (!actConf.dynamicApi) {
            return actConf.api;
        } else {
            if (row[actConf.dynamicApi] === 'paymentreceipt') {
                return 'payment-receipts';
            } else {
                return 'sales-invoices';
            }
        }
    }

    /**
     * updates products list
     */
    patchProduct(row, conf, siltable) {
        this.dataLayer.update('price-list-products', row.id, row).subscribe({
            next: () => {
                const msg = 'Updated products details';
                const context = 'Updated Product Pricelist';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.getData();
                siltable.disableSubmit = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                siltable.disableSubmit = false;
                const msg = 'Failed to update products details';
                const context = 'Update';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    /**
     * updates Return Outwards Item
     */
    patchReturnItem(row, conf, siltable) {
        this.dataLayer.update('return-outwardlines', row.id, row).subscribe({
            next: () => {
                const msg = 'Updated return outwards item';
                const context = 'Updated Return Outwards Item';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.getData();
                siltable.disableSubmit = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                siltable.disableSubmit = false;
                const msg = 'Failed to update return outwards item';
                const context = 'Update';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    /**
     * updates Direct Purchase Order Item
     */
    patchDirectPurchaseOrder(row, conf, siltable) {
        this.dataLayer.update('purchases-orderlines', row.id, row).subscribe({
            next: () => {
                const msg = 'Updated purchase order item';
                const context = 'Updated Direct Purchase Order Item';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.getData();
                siltable.disableSubmit = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                siltable.disableSubmit = false;
                const msg = 'Failed to update purchase order item';
                const context = 'Update';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    patchTransferItem(row, conf, siltable) {
        /**
         * Get selectedItem ID from list table
         */
        const productID = siltable?.selectedItem?.id;

        this.dataLayer
            .updateNested('inventory-operation-line', productID, conf?.view, {
                quantity_confirmed: row?.quantity_confirmed,
            })
            .subscribe({
                next: () => {
                    const msg = 'Updated item details';
                    const context = 'Updated Transfer Item Details';
                    this.showToast('bottom-right', 'success', context, msg);
                    siltable.showModal = false;
                    siltable.disableSubmit = false;
                    siltable.getData();
                },
                error: err => {
                    siltable.disableSubmit = false;
                    const msg = 'Failed to update transfer item details';
                    const context = 'Update';
                    this.showToast('bottom-right', 'danger', msg, context);
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    removeTransferItem(row, conf, siltable) {
        const patchObj = {
            id: row?.id,
        };
        this.dataLayer
            .updateNested(
                'inventory-operations',
                row?.inventory_operation,
                conf?.view,
                patchObj
            )
            .subscribe({
                next: () => {
                    const msg = 'Removed item';
                    const context = 'Removed Transfer Item Successfully';
                    this.showToast('bottom-right', 'success', context, msg);
                    siltable.showModal = false;
                    siltable.disableSubmit = false;
                    siltable.getData();
                },
                error: err => {
                    siltable.disableSubmit = false;
                    const msg = 'Failed to remove transfer item details';
                    const context = 'Remove';
                    this.showToast('bottom-right', 'danger', msg, context);
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    patchAdjustmentItem(row, conf, siltable) {
        /**
         * Get selectedItem ID from list table
         */

        const adjustmentID = siltable?.selectedItem?.id;
        const payload = {
            quantity: row?.quantity,
            product: row?.product,
        };

        this.dataLayer
            .update('inventory-adjustment-line', adjustmentID, payload)
            .subscribe({
                next: () => {
                    const msg = 'Update item';
                    const context = 'Updated Item successfully';
                    this.showToast('bottom-right', 'success', context, msg);
                    siltable.showModal = false;
                    siltable.disableSubmit = false;
                    siltable.getData();
                },
                error: err => {
                    siltable.disableSubmit = false;
                    const msg = 'Failed to update adjustment item';
                    const context = 'Update';
                    this.showToast('bottom-right', 'danger', msg, context);
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    removeAdjustmentItem(row, conf, siltable) {
        this.dataLayer.remove('inventory-adjustment-line', row?.id).subscribe(
            () => {
                const msg = 'Deleted item successfully';
                const context = 'Delete Adjustment Item';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.disableSubmit = false;
                siltable.getData();
                this.$state.reload();
            },
            err => {
                siltable.disableSubmit = false;
                const msg = 'Failed to delete adjustment item';
                const context = 'Delete Item';
                this.showToast('bottom-right', 'danger', context, msg);
                this.errorHandler.handleError(err, this);
            }
        );
    }

    // Handles Edit functionality on the Purchase - Requisition Page
    patchRequestedProduct(row, conf, siltable) {
        /**
         * Get selectedItem ID from list table
         */

        const requisitionID = siltable?.selectedItem?.id;
        const payload = {
            product: row?.product,
            product_uom: row?.product_uom,
            quantity: row?.quantity,
        };

        this.dataLayer
            .updateNested('requisitions-lines', requisitionID, '', payload)
            .subscribe({
                next: () => {
                    const msg = 'Update Requested Product';
                    const context = 'Updated requested item successfully';
                    this.showToast('bottom-right', 'success', context, msg);
                    siltable.showModal = false;
                    siltable.disableSubmit = false;
                    siltable.getData();
                },
                error: err => {
                    siltable.disableSubmit = false;
                    const msg = 'Failed to update requested product details';
                    const context = 'Update';
                    this.showToast('bottom-right', 'danger', msg, context);
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    // Handles Delete functionality for deleting requested product on the Purchase - Requisition Page
    removeRequestedProduct(siltable) {
        this.dataLayer.remove('requisitions-lines', siltable?.id).subscribe(
            () => {
                const msg = 'Deleted requested product successfully';
                const context = 'Delete Requested Product';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.disableSubmit = false;
                siltable.getData();
            },
            err => {
                siltable.disableSubmit = false;
                const msg = 'Failed to delete requested product';
                const context = 'Delete Requested Product';
                this.showToast('bottom-right', 'danger', msg, context);
                this.errorHandler.handleError(err, this);
            }
        );
    }

    // Handles Delete functionality for deleting requisition attachment on the Purchase - Requisition Page
    removeRequisitionAttachment(siltable) {
        this.dataLayer
            .remove('requisition-attachments', siltable?.id)
            .subscribe(
                () => {
                    const msg = 'Deleted requisition attachment successfully';
                    const context = 'Delete Requisition Attachment';
                    this.showToast('bottom-right', 'success', context, msg);
                    siltable.showModal = false;
                    siltable.disableSubmit = false;
                    siltable.getData();
                },
                err => {
                    siltable.disableSubmit = false;
                    const msg = 'Failed to delete requisition attachment';
                    const context = 'Delete Requisition Attachment';
                    this.showToast('bottom-right', 'danger', msg, context);
                    this.errorHandler.handleError(err, this);
                }
            );
    }

    /**
     * Reusable method for post requests
     */
    genericPost(row, conf, siltable) {
        const postObj = {};
        // Add data from the row to the payload
        if (conf.data) {
            for (let i = 0; i < conf.data.length; i++) {
                if (conf.data[i].value.includes('.')) {
                    postObj[conf.data[i].key] = this.mineValue(
                        row,
                        conf.data[i].value
                    );
                } else {
                    postObj[conf.data[i].key] = row[conf.data[i].value];
                }
            }
        }
        // Add default data to the payload
        if (conf.defaultData) {
            for (let i = 0; i < conf.defaultData.length; i++) {
                postObj[conf.defaultData[i].key] = conf.defaultData[i].value;
            }
        }

        this.dataLayer.create(conf.store, postObj).subscribe({
            next: (data: any) => {
                // A value the caller can only be told once, such as a new
                // password, is read off the response rather than dropped.
                const fromData = conf.dataMessage && data?.[conf.dataMessage];
                this.showToast(
                    'bottom-right',
                    'success',
                    fromData ? conf.dataTitle : conf.successTitle,
                    fromData || conf.successMessage
                );
                siltable.getData();
                siltable.showModal = false;
                siltable.disableSubmit = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                const msg = err?.message;
                siltable.disableSubmit = false;
                const context = conf.failedTitle;
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    mapImport(model) {
        const params = {
            product: model?.product,
            quantity: model?.number_of_packages * model?.quantity_per_package,
        };

        this.dataLayer.update('imports', model.id, params).subscribe({
            next: () => {
                const msg = 'Import mapped';
                this.showToast(
                    'bottom-right',
                    'success',
                    msg,
                    'Import has been mapped successfully'
                );
                this.$state.reload();
            },
            error: err => {
                this.errorHandler.handleError(err, this);
            },
        });
    }

    processBOM(row, conf, siltable) {
        const dataObj = {
            view: 'process_bom',
            id: siltable.selectedItem.id,
            row: row,
            conf: conf,
        };

        this.dataLayer
            .createNested('bom-operations', dataObj.view, dataObj.id)
            .subscribe({
                next: () => {
                    const msg = 'BOM Operation Processed Successfully';
                    const context = 'Process BOM Operation';
                    this.showToast('bottom-right', 'success', context, msg);
                    siltable.getData();
                },
                error: err => {
                    this.errorHandler.handleError(err, this.component);
                    const msg = 'Failed to process BOM operation';
                    const context = 'Process BOM Operation';
                    this.showErrorToast('bottom-right', 'danger', msg, context);
                },
            });
    }

    removeInvoiceItem(siltable) {
        this.dataLayer.remove('sales-invoice-lines', siltable?.id).subscribe(
            () => {
                const msg = 'Deleted item successfully';
                const context = 'Delete Invoice Item';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.disableSubmit = false;
                siltable.getData();
            },
            err => {
                siltable.disableSubmit = false;
                const msg = 'Failed to delete invoice item';
                const context = 'Delete Item';
                this.showToast('bottom-right', 'danger', msg, context);
                this.errorHandler.handleError(err, this);
            }
        );
    }

    removeOrderItem(siltable) {
        this.dataLayer.remove('sales-order-lines', siltable?.id).subscribe(
            () => {
                const msg = 'Deleted item successfully';
                const context = 'Delete Order Item';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.disableSubmit = false;
                siltable.getData();
            },
            err => {
                siltable.disableSubmit = false;
                const msg = 'Failed to delete order item';
                const context = 'Delete Item';
                this.showToast('bottom-right', 'danger', msg, context);
                this.errorHandler.handleError(err, this);
            }
        );
    }

    removeOrderAttachment(siltable) {
        this.dataLayer
            .remove('sales-order-attachments', siltable?.id)
            .subscribe(
                () => {
                    const msg = 'Deleted attachment successfully';
                    const context = 'Delete Order Attachment';
                    siltable.showModal = false;
                    siltable.disableSubmit = false;
                    this.$state.reload();
                    this.showToast('bottom-right', 'success', context, msg);
                },
                err => {
                    siltable.disableSubmit = false;
                    const msg = 'Failed to delete order attachment';
                    const context = 'Delete Attachment';
                    this.showToast('bottom-right', 'danger', msg, context);
                    this.errorHandler.handleError(err, this);
                }
            );
    }

    createMessageLogsReport(cmpt, event, transitionTo) {
        cmpt.downloadBtnStatus = true;
        const payload = { ...event };
        if (!payload.delivery_type) {
            delete payload.delivery_type;
        }

        this.dataLayer.create('generate_sms_log_report', payload).subscribe({
            next: (response: any) => {
                const downloadLogId = response?.id;
                payload['id'] = downloadLogId;
                cmpt.downloadBtnStatus = false;
                cmpt.$state.go(transitionTo, payload);
            },
        });
    }

    /**
     * Delete direct invoice intem
     */
    deleteDirectInvoiceItem(row, siltable) {
        this.dataLayer.remove('purchase-invoicelines', row?.id).subscribe({
            next: () => {
                const msg = `${row?.product_name} has been deleted successfully`;
                const context = 'Deleted';
                this.showToast('bottom-right', 'success', msg, context);
                siltable.showModal = false;
                siltable.disableSubmit = false;
                this.$state.reload();
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                siltable.disableSubmit = false;
                const msg = 'Failed to delete item';
                const context = 'Deleting';
                this.showErrorToast('bottom-right', 'danger', msg, context);
            },
        });
    }

    submitProcessInvoice(row, conf, siltable) {
        const dataObj = {
            view: 'approve',
            id: siltable.selectedItem.id,
            row: row,
            conf: conf,
        };

        this.dataLayer
            .createNested(
                'recon-invoiceline',
                dataObj.view,
                dataObj.id,
                dataObj.row
            )
            .subscribe({
                next: () => {
                    const msg = 'Approve reason was successfully added';
                    const context = 'Approve reason added';
                    this.showToast('bottom-right', 'success', context, msg);
                    siltable.showModal = false;
                    this.$state.reload();
                },
                error: err => {
                    this.errorHandler.handleError(err, this.component);
                    const msg = 'Failed to add approve reason';
                    const context = 'Approve reason';
                    this.showErrorToast('bottom-right', 'danger', msg, context);
                },
            });
    }

    submitDeclineReason(row, conf, siltable) {
        const dataObj = {
            view: 'decline',
            id: siltable.selectedItem.id,
            row: row,
            conf: conf,
        };

        this.dataLayer
            .createNested(
                'recon-invoiceline',
                dataObj.view,
                dataObj.id,
                dataObj.row
            )
            .subscribe({
                next: () => {
                    const msg = 'Decline reason was successfully added';
                    const context = 'Decline reason added';
                    this.showToast('bottom-right', 'success', context, msg);
                    siltable.showModal = false;
                    siltable.getData();
                },
                error: err => {
                    this.errorHandler.handleError(err, this.component);
                    const msg = 'Failed to add decline reason';
                    const context = 'Decline reason';
                    this.showErrorToast('bottom-right', 'danger', msg, context);
                },
            });
    }

    patchSupplierPaymentLine(row, conf, siltable) {
        /**
         * Get selectedItem ID from list table
         */
        const paymentLineId = siltable?.selectedItem?.id;

        this.dataLayer
            .update('supplier-payment-runs-lines', paymentLineId, conf?.view)
            .subscribe({
                next: () => {
                    const msg =
                        'Updated supplier payment run line successfully';
                    const context = 'Update line';
                    this.showToast('bottom-right', 'success', context, msg);
                    siltable.showModal = false;
                    siltable.disableSubmit = false;
                    this.$state.reload();
                },
                error: err => {
                    siltable.disableSubmit = false;
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    removeSupplierPaymentLine(row, conf, siltable) {
        this.dataLayer
            .remove('supplier-payment-runs-lines', row?.id)
            .subscribe({
                next: () => {
                    const msg =
                        'Removed supplier payment run line successfully';
                    const context = 'Remove line';
                    this.showToast('bottom-right', 'success', context, msg);
                    siltable.showModal = false;
                    siltable.disableSubmit = false;
                    this.$state.reload();
                },
                error: err => {
                    siltable.disableSubmit = false;
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    /**
     * Update payment method details
     */
    patchPaymentMethod(row, conf, siltable) {
        this.dataLayer.update('payment-methods', row?.id, row).subscribe({
            next: () => {
                const context = 'Updated Payment Method';
                const msg = 'Payment method updated';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.disableSubmit = false;
                this.$state.reload();
            },
            error: err => {
                siltable.disableSubmit = false;
                this.errorHandler.handleError(err, this);
            },
        });
    }

    retirePaymentMethod(row, conf, siltable) {
        const patchObj = {
            active: false,
            id: row?.id,
        };

        this.dataLayer.update('payment-methods', row?.id, patchObj).subscribe({
            next: () => {
                const context = 'Retire Payment Method';
                const msg = 'Payment method retired';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.disableSubmit = false;
                this.$state.reload();
            },
            error: err => {
                siltable.disableSubmit = false;
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /**
     * Updates bill item details
     */
    patchBillItem(row, conf, siltable) {
        this.dataLayer.update('bill-items', row.id, row).subscribe({
            next: () => {
                const msg = 'Updated bill item details';
                const context = 'Bill Item';
                this.showToast('bottom-right', 'success', context, msg);
                if (siltable) {
                    siltable.showModal = false;
                    siltable.disableSubmit = false;
                }
                this.$state.reload();
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                const msg = 'Failed to update bill item details';
                const context = 'Update';
                this.showErrorToast('bottom-right', 'danger', msg, context);
                if (siltable) {
                    siltable.disableSubmit = false;
                }
            },
        });
    }

    /**
     * Remove bill item
     */
    removeBillItem(row, conf, siltable) {
        this.dataLayer.remove('bill-items', row.id).subscribe({
            next: () => {
                const msg = 'Removed bill item';
                const context = 'Remove Bill Item';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.disableSubmit = false;
                this.$state.reload();
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                const msg = 'Failed to remove bill item';
                const context = 'Remove bill item';
                this.showErrorToast('bottom-right', 'danger', msg, context);
                siltable.disableSubmit = false;
            },
        });
    }

    /**
     * Updates opposing entry details
     */
    editOpposingEntry(row, conf, siltable) {
        row.line_account = row?.selectedItem?.id;
        this.dataLayer.update('journalentrylines', row?.id, row).subscribe({
            next: () => {
                const context = 'Updated Opposing Entry';
                const msg = `${
                    row.entry_type === 'cr' ? 'Credit' : 'Debit'
                } of ${row?.line_amount} on ${
                    row?.account_name
                } has been updated successfully`;
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                this.$state.reload();
            },
            error: err => {
                siltable.disableSubmit = false;
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /**
     * Updates subtopic details
     */
    patchSubtopic(row, conf, siltable) {
        this.dataLayer.update('userguides', row.id, row).subscribe({
            next: () => {
                const msg = 'Updated subtopic details';
                const context = 'Subtopic';
                this.showToast('bottom-right', 'success', context, msg);
                if (siltable) {
                    siltable.showModal = false;
                    siltable.disableSubmit = false;
                }
                siltable.getData();
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                const msg = 'Failed to update subtopic details';
                const context = 'Update';
                this.showErrorToast('bottom-right', 'danger', msg, context);
                if (siltable) {
                    siltable.disableSubmit = false;
                }
            },
        });
    }

    /**
     * Remove subtopic
     */
    removeSubtopic(row, conf, siltable) {
        this.dataLayer.remove('userguides', row.id).subscribe({
            next: () => {
                const msg = 'Removed subtopic';
                const context = 'Remove Subtopic';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.disableSubmit = false;
                siltable.getData();
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                const msg = 'Failed to remove subtopic';
                const context = 'Remove subtopic';
                this.showErrorToast('bottom-right', 'danger', msg, context);
                siltable.disableSubmit = false;
            },
        });
    }

    /**
     * Updates topic (guide) details
     */
    patchTopic(row, conf, siltable) {
        this.dataLayer.update('userguides', row.id, row).subscribe({
            next: () => {
                const msg = 'Updated guide details';
                const context = 'Guide';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.disableSubmit = false;
                siltable.getData();
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                const msg = 'Failed to update guide details';
                const context = 'Update';
                this.showErrorToast('bottom-right', 'danger', msg, context);
                siltable.disableSubmit = false;
            },
        });
    }

    /**
     * Remove guide
     */
    removeGuide(row, conf, siltable) {
        this.dataLayer.remove('userguides', row.id).subscribe({
            next: () => {
                const msg = 'Removed guide';
                const context = 'Remove Guide';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.disableSubmit = false;
                siltable.getData();
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                const msg = 'Failed to remove guide';
                const context = 'Remove guide';
                this.showErrorToast('bottom-right', 'danger', msg, context);
                siltable.disableSubmit = false;
            },
        });
    }

    /**
     * Removes a location from a pricelist
     * @param row - The row containing the location to be removed
     * @param conf - Configuration object containing pricelistId
     * @param siltable - The table instance to update after removal
     */
    removePricelistLocation(row, conf, siltable) {
        const pricelistId = conf?.pricelistId || row.pricelistId;

        if (!pricelistId) {
            this.showToast(
                'bottom-right',
                'danger',
                'Error',
                'Pricelist ID missing'
            );
            return;
        }

        this.dataLayer.get('pricelists', pricelistId).subscribe({
            next: (pricelist: any) => {
                const updatedLocations = (pricelist.locations || []).filter(
                    id => id !== row.id
                );

                this.dataLayer
                    .update('pricelists', pricelistId, {
                        locations: updatedLocations,
                    })
                    .subscribe({
                        next: () => {
                            const msg = 'Removed location from pricelist';
                            const context = 'Pricelist Location';
                            this.showToast(
                                'bottom-right',
                                'success',
                                context,
                                msg
                            );
                            siltable.showModal = false;
                            siltable.disableSubmit = false;
                            setTimeout(() => {
                                this.$state.reload();
                            }, 500);
                        },
                        error: err => {
                            siltable.disableSubmit = false;
                            const msg = 'Failed to remove location';
                            const context = 'Remove';
                            this.showToast(
                                'bottom-right',
                                'danger',
                                msg,
                                context
                            );
                            this.errorHandler.handleError(err, this);
                        },
                    });
            },
            error: err => {
                siltable.disableSubmit = false;
                const msg = 'Failed to fetch pricelist';
                const context = 'Remove';
                this.showToast('bottom-right', 'danger', msg, context);
                this.errorHandler.handleError(err, this);
            },
        });
    }
    /**
     * Removes a product from a pricelist
     * @param row - The row containing the product to be removed
     * @param conf - Configuration object
     * @param siltable - The table instance to update after removal
     */
    removePricelistProduct(row, conf, siltable) {
        this.dataLayer.remove('price-list-products', row.id).subscribe({
            next: () => {
                const msg = 'Removed product from pricelist';
                const context = 'Pricelist Product';
                this.showToast('bottom-right', 'success', context, msg);
                siltable.showModal = false;
                siltable.disableSubmit = false;
                if (typeof siltable.getData === 'function') {
                    siltable.getData();
                }
            },
            error: err => {
                siltable.disableSubmit = false;
                const msg = 'Failed to remove product from pricelist';
                const context = 'Remove Pricelist Product';
                this.showToast('bottom-right', 'danger', msg, context);
                this.errorHandler.handleError(err, this);
            },
        });
    }

    activateOrgFeatureMethod(row, conf, siltable) {
        const patchObj = {
            active: true,
            id: row?.id,
        };

        this.dataLayer
            .update('organisation-features', row?.id, patchObj)
            .subscribe({
                next: () => {
                    const context = 'Activate Org Feature';
                    const msg = 'Activate org. feature successfully!';
                    this.showToast('bottom-right', 'success', context, msg);
                    siltable.showModal = false;
                    siltable.disableSubmit = false;
                    this.$state.reload();
                },
                error: err => {
                    siltable.disableSubmit = false;
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    deactivateOrgFeatureMethod(row, conf, siltable) {
        const patchObj = {
            active: false,
            id: row?.id,
        };

        this.dataLayer
            .update('organisation-features', row?.id, patchObj)
            .subscribe({
                next: () => {
                    const context = 'Deactivate Org Feature';
                    const msg = 'Deactivate org. feature successfully';
                    this.showToast('bottom-right', 'success', context, msg);
                    siltable.showModal = false;
                    siltable.disableSubmit = false;
                    this.$state.reload();
                },
                error: err => {
                    siltable.disableSubmit = false;
                    this.errorHandler.handleError(err, this);
                },
            });
    }
}
