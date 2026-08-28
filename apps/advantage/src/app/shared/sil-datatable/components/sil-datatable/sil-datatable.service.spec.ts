import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition } from '@uirouter/angular';
import { AnalyticsService } from 'app/@core/utils/analytics.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../app-config.service';
import { ItemListService } from '../../../../features/advantage/inventory/add-items/add-item-list.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { SilDatatableService } from './sil-datatable.service';
import { ErrorHandlerService } from '../../../sil-http-services/error-handler';

class SilStoresServiceStub {
    customUpdate() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    update() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    create() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    updateNested() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    updateResource() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    createNested() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    get() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
        });
    }
    list() {
        return of({
            results: [],
        });
    }
    remove() {
        return of({
            id: '1231',
        });
    }
}

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

class StateServiceStub {
    reload() {
        return true;
    }
    includes() {
        return true;
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

class AuthorizationConfigStub {
    getUser() {
        const stringified = JSON.stringify({
            business_partner: 1,
            client_types: ['PROVIDER'],
        });
        return stringified;
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
    setOrganisationSettings() {
        return of(() => {});
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class ErrorHandlerServiceStub {
    handleError(err, component) {
        // return both so we use the params and avoid tslint errors
        return { err, component };
    }
}

class ItemListServiceStub {
    private mockItemsList = new BehaviorSubject<Array<any>>([]);
    itemsList$ = this.mockItemsList.asObservable();
    addItem() {
        return true;
    }
    getItems() {
        return of([]);
    }
    removeAll() {
        return true;
    }
    removeById() {
        return true;
    }
    updateItemById() {
        return true;
    }
}

describe('SilDatatableService', () => {
    let service: SilDatatableService;
    let silStoresService: SilStoresService;
    let stateService: StateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SilDatatableService,
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: () => 1, // represents the bookId
                            },
                        },
                    },
                },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: ErrorHandlerService,
                    useClass: ErrorHandlerServiceStub,
                },
                { provide: ItemListService, useClass: ItemListServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(SilDatatableService);

        silStoresService = TestBed.inject(SilStoresService);
        stateService = TestBed.inject(StateService);
    });

    it('should test patchPatient when person_contacts or person_ids is empty', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            expected_delivery_date: '22-07-08',
            person: {
                email: 'test@email.com',
                id_value: '1234567',
                date_of_birth: '22-07-08',
                phone_number: '25412345678',
                person_contacts: [],
                person_ids: [],
                person_photos: [],
            },
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'patchPatient').and.callThrough();
        service.patchPatient(row, null, table);
        service.patchPractitioner(row, null, table);
        expect(service.patchPatient).toHaveBeenCalled();
    });

    it('should test genericPost', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            person: {
                id: '212',
            },
        };
        const conf = {
            data: [
                { key: 'test', value: 'id' },
                { key: 'perons', value: 'person.id' },
            ],
            defaultData: [{ key: 'status', value: 'VERIFIED' }],
            store: 'test',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'genericPost').and.callThrough();
        service.genericPost(row, conf, table);
        const conf2 = {
            data: [{ key: 'test', value: 'id' }],
            store: 'test',
        };
        service.genericPost(row, conf2, table);
        expect(service.genericPost).toHaveBeenCalled();
    });

    it('should test patchPatient', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            person: {
                email: 'test@email.com',
                id_value: '1234567',
                date_of_birth: '22-07-08',
                person_contacts: [
                    {
                        contact_type: 'phone_number',
                        contact: '+25412345678',
                        is_primary_contact: true,
                        id: '1221',
                    },
                    {
                        contact_type: 'phone_number',
                        contact: '12345678',
                        is_primary_contact: false,
                        id: '1221',
                    },
                    {
                        contact_type: 'email',
                        contact: 'test@email.com',
                        is_primary_contact: false,
                        id: '32323',
                    },
                ],
                person_ids: [
                    {
                        id_value: '1234',
                        id_document_type: 'nationalID',
                        id: '821367',
                    },
                ],
                person_photos: [],
            },
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'patchPatient').and.callThrough();
        service.patchPatient(row, null, table);
        expect(service.patchPatient).toHaveBeenCalled();
    });

    it('should handle expected_delivery_date when variant is uzazisalama', () => {
        service.variant = 'uzazisalama';
        const row = {
            id: '12312',
            expected_delivery_date: '2024-01-01',
            person: {
                date_of_birth: '22-07-08',
                person_contacts: [],
                person_ids: [],
                person_photos: [],
            },
        };
        const table = {
            getData: () => {},
        };

        spyOn(service, 'patchPatient').and.callThrough();
        service.patchPatient(row, null, table);
        expect(service.patchPatient).toHaveBeenCalled();
    });

    it('should not include expected_delivery_date when variant is not uzazisalama', () => {
        service.variant = 'other-variant';
        const row = {
            id: '12312',
            expected_delivery_date: '2024-01-01',
            person: {
                date_of_birth: '22-07-08',
                person_contacts: [],
                person_ids: [],
                person_photos: [],
            },
        };
        const table = {
            getData: () => {},
        };

        spyOn(service, 'patchPatient').and.callThrough();
        service.patchPatient(row, null, table);
        expect(service.patchPatient).toHaveBeenCalled();
    });

    it('should test patchPractitioner', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            person: {
                id_value: '1234567',
                date_of_birth: '22-07-08',
                person_contacts: [
                    {
                        contact_type: 'phone_number',
                        contact: '+25412345678',
                        is_primary_contact: true,
                        id: '1221',
                    },
                    {
                        contact_type: 'phone_number',
                        contact: '12345678',
                        is_primary_contact: false,
                        id: '1221',
                    },
                    {
                        contact_type: 'email',
                        contact: 'test@email.com',
                        is_primary_contact: false,
                        id: '32323',
                    },
                ],
                person_ids: [],
                person_photos: [],
            },
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'patchPractitioner').and.callThrough();
        service.patchPractitioner(row, null, table);
        expect(service.patchPractitioner).toHaveBeenCalled();
    });

    it('should test patchNextOfKin', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '1234567',
            gender: 'MALE',
            first_name: 'John',
            last_name: 'Doe',
            date_of_birth: '22-07-08',
            person_contacts: [
                {
                    contact_type: 'phone_number',
                    contact: '87654321',
                },
                {
                    contact_type: 'phone_number',
                    contact: '+25412345678',
                },
            ],
            relationship: 'SIB',
            person_ids: [],
        };
        const table = {
            getData: () => {},
            data: {
                visit: 1,
            },
        };
        const conf = {
            nestedId: '1234',
        };
        spyOn(service, 'patchNextOfKin').and.callThrough();
        service.patchNextOfKin(row, conf, table);
        expect(service.patchNextOfKin).toHaveBeenCalled();
    });

    it('should test removeRelationship', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '1234567',
            gender: 'MALE',
            first_name: 'John',
            last_name: 'Doe',
            date_of_birth: '22-07-08',
            person_contacts: [
                { contact_type: 'phone_number', contact: '25412345678' },
            ],
            relationship: 'SIB',
            person_ids: [],
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'removeRelationship').and.callThrough();
        service.removeRelationship(row.id, null, table);
        expect(service.removeRelationship).toHaveBeenCalled();
    });

    it('should test patchAppointment and patchCheckinAppointment', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            appointment_status: 'BOOKED',
            reason: 'flu',
            slot: {
                id: 1,
                start: 'now',
                end: 'later',
            },
        };
        const table = {
            getData: () => {},
            setParams: () => {},
        };
        spyOn(service, 'patchAppointment').and.callThrough();
        service.patchAppointment(row, null, table);
        expect(service.patchAppointment).toHaveBeenCalled();
        spyOn(service, 'patchCheckinAppointment').and.callThrough();
        service.patchCheckinAppointment(row, null, table);
        expect(service.patchCheckinAppointment).toHaveBeenCalled();
    });

    it('should test patchSegmentMember', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const conf = {
            status: 'CONFIRMED',
        };
        const table = {
            getData: () => {},
            setParams: () => {},
        };
        spyOn(service, 'patchSegmentMember').and.callThrough();
        service.patchSegmentMember(row, conf, table);
        expect(service.patchSegmentMember).toHaveBeenCalled();
    });

    it('should test transitionStatus', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            status: 'ACTIVE',
        };
        const conf = {
            store: 'care-journeys',
            api: 'care-journeys',
            context: 'Retire Journey',
            patchObject: {
                status: 'RETIRED',
            },
            action: 'quickPatch',
            httpMethod: 'update',
            method: 'transitionStatus',
            title: 'Journey',
            successTitle: 'Retire Journey',
            successMessage: 'Journey retired successfully',
            failedTitle: 'Retire Journey',
            failedMessage: 'Journey retiring was unsuccessful',
            state: '',
        };
        const table = {
            getData: () => {},
            setParams: () => {},
        };
        spyOn(service, 'transitionStatus').and.callThrough();
        service.transitionStatus(row, conf, table);
        expect(service.transitionStatus).toHaveBeenCalled();
    });

    it('should test confirmArrival', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            appointment_status: 'ARRIVED',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'confirmArrival').and.callThrough();
        service.confirmArrival(row, null, table);
        expect(service.confirmArrival).toHaveBeenCalled();
    });

    it('should test markFulfilled', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'markFulfilled').and.callThrough();
        service.markFulfilled(row, null, table);
        expect(service.markFulfilled).toHaveBeenCalled();
    });

    it('should test confirmArrival error', () => {
        const row = {
            id: '12312',
            appointment_status: 'ARRIVED',
        };
        const conf = {
            value: 'YES',
        };
        const table = {
            getData: () => {},
        };
        const comp = {};
        service.setupComponent(comp);
        spyOn(service, 'confirmArrival').and.callThrough();
        service.confirmArrival(row, undefined, table);
        service.refreshData(conf);
        expect(service.confirmArrival).toHaveBeenCalled();
    });

    it('should test markFulfilled error', () => {
        const row = {
            id: '12312',
        };
        const conf = {
            value: 'YES',
        };
        const table = {
            getData: () => {},
        };
        const comp = {};
        service.setupComponent(comp);
        spyOn(service, 'markFulfilled').and.callThrough();
        service.markFulfilled(row, undefined, table);
        service.refreshData(conf);
        expect(service.markFulfilled).toHaveBeenCalled();
    });

    it('should call handleError & showErrorToast when outer update errors during confirmArrival', fakeAsync(() => {
        const comp = { some: 'component' };
        service.setupComponent(comp);

        const row = {
            id: '98765',
            appointment_status: 'ARRIVED',
        } as any;

        const table = {
            getData: () => {},
        } as any;

        const outerErr = new Error('outer update failed');
        spyOn(silStoresService, 'update').and.returnValue(
            throwError(() => outerErr)
        );

        spyOn(service, 'showErrorToast');
        const errorHandler = TestBed.inject(ErrorHandlerService);
        spyOn(errorHandler, 'handleError').and.callThrough();

        service.confirmArrival(row, null, table);
        tick();

        expect(errorHandler.handleError).toHaveBeenCalledWith(
            outerErr,
            service.component
        );
        expect(service.showErrorToast).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Failed to confirm arrival',
            'Confirm Arrival'
        );
    }));
    it('should call handleError & showErrorToast when outer update errors during markFulfilled', fakeAsync(() => {
        const comp = { some: 'component' };
        service.setupComponent(comp);

        const row = {
            id: '98765',
        } as any;

        const table = {
            getData: () => {},
        } as any;

        const outerErr = new Error('outer update failed');
        spyOn(silStoresService, 'update').and.returnValue(
            throwError(() => outerErr)
        );

        spyOn(service, 'showErrorToast');
        const errorHandler = TestBed.inject(ErrorHandlerService);
        spyOn(errorHandler, 'handleError').and.callThrough();

        service.markFulfilled(row, null, table);
        tick();

        expect(errorHandler.handleError).toHaveBeenCalledWith(
            outerErr,
            service.component
        );
        expect(service.showErrorToast).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Failed to mark appointment as fulfilled',
            'Mark As Fulfilled'
        );
    }));

    it('should call handleError when inner update errors during confirmArrival', fakeAsync(() => {
        const comp = { some: 'component' };
        service.setupComponent(comp);

        const row = {
            id: '98766',
            appointment_status: 'ARRIVED',
        } as any;

        const table = {
            getData: () => {},
        } as any;

        const innerErr = new Error('inner update failed');

        // First call (ARRIVED) succeeds, second call (FULFILLED) errors
        spyOn(silStoresService, 'update').and.returnValues(
            of({ success: true }),
            throwError(() => innerErr)
        );

        const errorHandler = TestBed.inject(ErrorHandlerService);
        spyOn(errorHandler, 'handleError').and.callThrough();
        spyOn(service, 'showErrorToast');

        service.confirmArrival(row, null, table);
        tick();

        // Should have been called with the service as the component param
        expect(errorHandler.handleError).toHaveBeenCalledWith(
            innerErr,
            service
        );
        expect(service.showErrorToast).not.toHaveBeenCalled();
    }));

    it('should call handleError when inner update errors during markFulfilled', fakeAsync(() => {
        const comp = { some: 'component' };
        service.setupComponent(comp);

        const row = {
            id: '98766',
        } as any;

        const table = {
            getData: () => {},
        } as any;

        const innerErr = new Error('inner update failed');

        spyOn(silStoresService, 'update').and.returnValues(
            of({ success: true }),
            throwError(() => innerErr)
        );

        const errorHandler = TestBed.inject(ErrorHandlerService);
        spyOn(errorHandler, 'handleError').and.callThrough();
        spyOn(service, 'showErrorToast');

        service.markFulfilled(row, null, table);
        tick();

        // Should have been called with the service as the component param
        expect(errorHandler.handleError).toHaveBeenCalledWith(
            innerErr,
            service
        );
        expect(service.showErrorToast).not.toHaveBeenCalled();
    }));

    it('should test cancelAppointment', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            appointment_status: 'CANCELLED',
            reason: 'flu',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'cancelAppointment').and.callThrough();
        service.cancelAppointment(row, null, table);
        expect(service.cancelAppointment).toHaveBeenCalled();
    });

    it('should test patchOrgSetting', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            value: 'value',
            name: 'setting',
        };
        const table = {
            getData: () => {},
        };
        const conf = {
            value: 'YES',
        };
        service.refreshData(conf);
        spyOn(service, 'patchOrgSetting').and.callThrough();
        service.patchOrgSetting(row, null, table);
        expect(service.patchOrgSetting).toHaveBeenCalled();
        service.patchOrgSetting(row, null, table);
    });

    it('should test patchBranchSettings', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            value: '123',
            name: 'setting',
        };
        const table = {
            getData: () => {},
        };
        const conf = {
            value: 'YES',
        };
        service.refreshData(conf);
        spyOn(service, 'patchBranchSettings').and.callThrough();
        service.patchBranchSettings(row, null, table);
        expect(service.patchBranchSettings).toHaveBeenCalled();
        service.patchBranchSettings(row, null, table);
    });

    it('should test addToQueue whem status PENDING', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            status: 'PENDING',
        };
        const table = {
            getData: () => {},
        };
        const conf = {
            value: 'YES',
        };
        service.refreshData(conf);
        spyOn(service, 'addToQueue').and.callThrough();
        service.addToQueue(row, null, table);
        expect(service.addToQueue).toHaveBeenCalled();
    });

    it('should test addToQueue when status WAITING', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            status: 'WAITING',
        };
        const table = {
            getData: () => {},
        };
        const conf = {
            value: 'YES',
        };
        service.refreshData(conf);
        spyOn(service, 'addToQueue').and.callThrough();
        service.addToQueue(row, null, table);
        expect(service.addToQueue).toHaveBeenCalled();
    });

    it('should test patchQueue', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            status: 'WAITING',
        };
        const table = {
            getData: () => {},
        };
        const conf = {
            value: 'YES',
        };
        spyOn(service, 'patchQueue').and.callThrough();
        service.refreshData(conf);
        service.patchQueue(row, null, table);
        expect(service.patchQueue).toHaveBeenCalled();
    });

    it('should test patchInvoiceLine', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
            data: {
                visit: 1,
            },
        };
        spyOn(service, 'patchInvoiceLine').and.callThrough();
        service.visitService.visit = {
            id: 1,
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
        };
        service.patchInvoiceLine(row, null, table);
        expect(service.patchInvoiceLine).toHaveBeenCalled();
    });

    it('should test removeInvoiceLine & refundPayment', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            invoice: '1',
        };
        const table = {
            getData: () => {},
            data: {
                visit: 1,
            },
            customFxn: {
                emit: () => {},
            },
        };
        spyOn(service, 'removeInvoiceLine').and.callThrough();
        spyOn(service, 'refundInvoiceLine').and.callThrough();
        spyOn(service, 'refundPayment').and.callThrough();
        service.visitService.visit = {
            id: 1,
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
        };
        service.removeInvoiceLine(row, null, table);
        service.refundInvoiceLine(row, null, table);
        service.refundPayment(row, null, table);
        expect(service.removeInvoiceLine).toHaveBeenCalled();
        expect(service.refundPayment).toHaveBeenCalled();
    });

    it('should test processDownloadStoreName', () => {
        const row = {
            id: '12312',
        };

        const actConf = {
            downloadId: 'source_document_ref',
            dynamicApi: 'content_type',
        };
        spyOn(service, 'processDownloadStoreName').and.callThrough();
        service.processDownloadStoreName(row, actConf);
        expect(service.processDownloadStoreName).toHaveBeenCalled();
    });

    it('should test processDownloadStoreName with dynamicApi as undefined', () => {
        const row = {
            id: '12312',
        };

        const actConf = {
            api: 'source_document_ref',
            dynamicApi: undefined,
        };
        spyOn(service, 'processDownloadStoreName').and.callThrough();
        service.processDownloadStoreName(row, actConf);
        expect(service.processDownloadStoreName).toHaveBeenCalled();
    });

    it('should test processDownloadStoreName with a content_type of salesinvoice', () => {
        const row = {
            id: '12312',
            content_type: 'salesinvoice',
        };
        const actConf = {
            downloadId: 'source_document_ref',
            dynamicApi: 'content_type',
        };

        spyOn(service, 'processDownloadStoreName').and.callThrough();
        const result = service.processDownloadStoreName(row, actConf);
        expect(result).toBe('sales-invoices');
    });

    it('should test patchGuidelines', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'patchGuidelines').and.callThrough();
        service.patchGuidelines(row, null, table);
        expect(service.patchGuidelines).toHaveBeenCalled();
    });

    it('should test patchPrompt', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'patchPrompt').and.callThrough();
        service.patchPrompt(row, null, table);
        expect(service.patchPrompt).toHaveBeenCalled();
    });

    it('should test patchAnswer', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const conf = {
            store: 'add-tax',
            api: 'taxes',
            action: 'quickPatch',
            httpMethod: 'update',
            method: 'genericPatch',
            successTitle: 'Edit Tax',
            successMessage: 'Tax edited',
            failedTitle: 'Edit Tax',
            failedMessage: 'Tax updating has',
        };
        spyOn(service, 'patchAnswer').and.callThrough();
        service.patchAnswer(row, conf);
        expect(service.patchAnswer).toHaveBeenCalled();
    });

    it('should test patchDisease', () => {
        const comp = {};
        service.setupComponent(comp);

        const clinicalGuidelineIds = ['123'];
        const patientGuidelineIds = ['123'];

        const row = {
            area: { id: '123', name: 'malaria' },
            disease: { display_name: 'malaria' },
            clinical_guidelines: [clinicalGuidelineIds],
            patient_guidelines: [patientGuidelineIds],
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'patchDisease').and.callThrough();
        service.patchDisease(row, null, table);
        expect(service.patchDisease).toHaveBeenCalled();
    });

    it('should test patchPatientGuidelines', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'patchPatientGuidelines').and.callThrough();
        service.patchPatientGuidelines(row, null, table);
        expect(service.patchPatientGuidelines).toHaveBeenCalled();
    });

    it('should test processDownloadStoreName with a content_type of paymentreceipt', () => {
        const row = {
            id: '12312',
            content_type: 'paymentreceipt',
        };
        const actConf = {
            downloadId: 'source_document_ref',
            dynamicApi: 'content_type',
        };

        spyOn(service, 'processDownloadStoreName').and.callThrough();
        const result = service.processDownloadStoreName(row, actConf);
        expect(result).toBe('payment-receipts');
    });

    it('should test patchProduct', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'patchProduct').and.callThrough();
        service.patchProduct(row, null, table);
        expect(service.patchProduct).toHaveBeenCalled();
    });

    it('should test patchReturnItem', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'patchReturnItem').and.callThrough();
        service.patchReturnItem(row, null, table);
        expect(service.patchReturnItem).toHaveBeenCalled();
    });

    it('should test patchDirectPurchaseOrder', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'patchDirectPurchaseOrder').and.callThrough();
        service.patchDirectPurchaseOrder(row, null, table);
        expect(service.patchDirectPurchaseOrder).toHaveBeenCalled();
    });

    it('should test removeReturnOutwardsLine', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'removeReturnOutwardsLine').and.callThrough();
        service.removeReturnOutwardsLine(row, null, table);
        expect(service.removeReturnOutwardsLine).toHaveBeenCalled();
    });

    it('should test removeDirectPurchaseOrderLine', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'removeDirectPurchaseOrderLine').and.callThrough();
        service.removeDirectPurchaseOrderLine(row, null, table);
        expect(service.removeDirectPurchaseOrderLine).toHaveBeenCalled();
    });

    it('should test patchTransferItem', fakeAsync(() => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
            selectedItem: {
                id: '1234',
            },
        };
        spyOn(service, 'patchTransferItem').and.callThrough();
        service.patchTransferItem(row, null, table);
        tick(3200);
        expect(service.patchTransferItem).toHaveBeenCalled();
    }));

    it('should test removeTransferItem', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            inventory_operation: '1234',
        };
        const table = {
            getData: () => {},
            selectedItem: {
                id: '1234',
            },
        };
        spyOn(service, 'removeTransferItem').and.callThrough();
        service.removeTransferItem(row, null, table);
        expect(service.removeTransferItem).toHaveBeenCalled();
    });

    it('should test patchAdjustmentItem', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const conf = '';
        const table = {
            getData: () => {},
            selectedItem: {
                id: '1234',
            },
        };
        spyOn(service, 'patchAdjustmentItem').and.callThrough();
        service.patchAdjustmentItem(row, conf, table);
        expect(service.patchAdjustmentItem).toHaveBeenCalled();
    });

    it('should test removeAdjustmentItem', () => {
        const comp = {};
        service.setupComponent(comp);

        const row = { id: '1234' };
        const conf = {};
        const siltable = {
            showModal: true,
            disableSubmit: true,
            getData: jasmine.createSpy('getData'),
        };
        spyOn(service, 'showToast');
        spyOn(service.$state, 'reload');

        service.removeAdjustmentItem(row, conf, siltable);

        expect(service.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Delete Adjustment Item',
            'Deleted item successfully'
        );
        expect(siltable.getData).toHaveBeenCalled();
        expect(service.$state.reload).toHaveBeenCalled();
        expect(siltable.showModal).toBe(false);
        expect(siltable.disableSubmit).toBe(false);
    });

    it('should test patchRequestedProduct', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const conf = '';
        const table = {
            getData: () => {},
            selectedItem: {
                id: '1234',
            },
        };
        spyOn(service, 'patchRequestedProduct').and.callThrough();
        service.patchRequestedProduct(row, conf, table);
        expect(service.patchRequestedProduct).toHaveBeenCalled();
    });

    it('should test removeRequestedProduct', () => {
        const comp = {};
        service.setupComponent(comp);

        const siltable = {
            id: '1234',
            getData: () => {},
        };
        spyOn(service, 'removeRequestedProduct').and.callThrough();
        service.removeRequestedProduct(siltable);
        expect(service.removeRequestedProduct).toHaveBeenCalled();
    });

    it('should remove pricelist product successfully', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = { id: '12345' };
        const conf = {};
        const siltable = {
            showModal: true,
            disableSubmit: true,
            getData: jasmine.createSpy('getData'),
        };
        spyOn(service, 'showToast');
        service.removePricelistProduct(row, conf, siltable);
        expect(service.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Pricelist Product',
            'Removed product from pricelist'
        );
        expect(siltable.getData).toHaveBeenCalled();
        expect(siltable.showModal).toBe(false);
        expect(siltable.disableSubmit).toBe(false);
    });

    it('should test removeRequisitionAttachment', () => {
        const comp = {};
        service.setupComponent(comp);

        const siltable = {
            id: '1234',
            getData: () => {},
        };
        spyOn(service, 'removeRequisitionAttachment').and.callThrough();
        service.removeRequisitionAttachment(siltable);
        expect(service.removeRequisitionAttachment).toHaveBeenCalled();
    });

    it('should test genericPatch', fakeAsync(() => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            valid_from: '2024-04-24',
            valid_to: '2025-04-24',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'genericPatch').and.callThrough();
        const conf = {
            store: 'add-tax',
            api: 'taxes',
            action: 'quickPatch',
            httpMethod: 'update',
            method: 'genericPatch',
            successTitle: 'Edit Tax',
            successMessage: 'Tax edited',
            failedTitle: 'Edit Tax',
            failedMessage: 'Tax updating has',
            patchObject: {
                status: 'ACTIVE',
            },
        };
        service.genericPatch(row, conf, table);
        conf['convertDates'] = [
            {
                format: 'YYYY-MM-DD',
                fields: ['valid_from', 'valid_to'],
            },
        ];
        service.genericPatch(row, conf, table);
        tick(500);
        expect(service.genericPatch).toHaveBeenCalled();
    }));
    it('should test updateProductPatch with categories as string', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            valid_from: '2024-04-24',
            valid_to: '2025-04-24',
            categories: 'panadol',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'updateProductPatch').and.callThrough();
        const conf = {
            store: 'add-tax',
            api: 'taxes',
            action: 'quickPatch',
            httpMethod: 'update',
            method: 'updateProductPatch',
            successTitle: 'Edit Tax',
            successMessage: 'Tax edited',
            failedTitle: 'Edit Tax',
            failedMessage: 'Tax updating has',
        };
        service.updateProductPatch(row, conf, table);
        conf['convertDates'] = [
            {
                format: 'YYYY-MM-DD',
                fields: ['valid_from', 'valid_to'],
            },
        ];
        service.updateProductPatch(row, conf, table);
        expect(service.updateProductPatch).toHaveBeenCalled();
    });

    it('should test updateProductPatch with categories as array of string', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            valid_from: '2024-04-24',
            valid_to: '2025-04-24',
            categories: ['1'],
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'updateProductPatch').and.callThrough();
        const conf = {
            store: 'add-tax',
            api: 'taxes',
            action: 'quickPatch',
            httpMethod: 'update',
            method: 'updateProductPatch',
            successTitle: 'Edit Tax',
            successMessage: 'Tax edited',
            failedTitle: 'Edit Tax',
            failedMessage: 'Tax updating has',
        };
        service.updateProductPatch(row, conf, table);
        conf['convertDates'] = [
            {
                format: 'YYYY-MM-DD',
                fields: ['valid_from', 'valid_to'],
            },
        ];
        service.updateProductPatch(row, conf, table);
        expect(service.updateProductPatch).toHaveBeenCalled();
    });

    it('should test updateProductPatch with categories as array of object', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            valid_from: '2024-04-24',
            valid_to: '2025-04-24',
            categories: [{ id: '1' }],
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'updateProductPatch').and.callThrough();
        const conf = {
            store: 'add-tax',
            api: 'taxes',
            action: 'quickPatch',
            httpMethod: 'update',
            method: 'updateProductPatch',
            successTitle: 'Edit Tax',
            successMessage: 'Tax edited',
            failedTitle: 'Edit Tax',
            failedMessage: 'Tax updating has',
        };
        service.updateProductPatch(row, conf, table);
        conf['convertDates'] = [
            {
                format: 'YYYY-MM-DD',
                fields: ['valid_from', 'valid_to'],
            },
        ];
        service.updateProductPatch(row, conf, table);
        expect(service.updateProductPatch).toHaveBeenCalled();
    });

    it('should test updateProductPatch with purchase_taxes', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            valid_from: '2024-04-24',
            valid_to: '2025-04-24',
            purchase_taxes: 'vat',
            categories: [],
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'updateProductPatch').and.callThrough();
        const conf = {
            store: 'add-tax',
            api: 'taxes',
            action: 'quickPatch',
            httpMethod: 'update',
            method: 'updateProductPatch',
            successTitle: 'Edit Tax',
            successMessage: 'Tax edited',
            failedTitle: 'Edit Tax',
            failedMessage: 'Tax updating has',
        };
        service.updateProductPatch(row, conf, table);
        conf['convertDates'] = [
            {
                format: 'YYYY-MM-DD',
                fields: ['valid_from', 'valid_to'],
            },
        ];
        service.updateProductPatch(row, conf, table);
        expect(service.updateProductPatch).toHaveBeenCalled();
    });

    it('should test updateProductPatch with sale_taxes', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            valid_from: '2024-04-24',
            valid_to: '2025-04-24',
            sale_taxes: 'vat',
            categories: [],
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'updateProductPatch').and.callThrough();
        const conf = {
            store: 'add-tax',
            api: 'taxes',
            action: 'quickPatch',
            httpMethod: 'update',
            method: 'updateProductPatch',
            successTitle: 'Edit Tax',
            successMessage: 'Tax edited',
            failedTitle: 'Edit Tax',
            failedMessage: 'Tax updating has',
        };
        service.updateProductPatch(row, conf, table);
        conf['convertDates'] = [
            {
                format: 'YYYY-MM-DD',
                fields: ['valid_from', 'valid_to'],
            },
        ];
        service.updateProductPatch(row, conf, table);
        expect(service.updateProductPatch).toHaveBeenCalled();
    });

    it('should test genericNestedPatch', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'genericNestedPatch').and.callThrough();
        const conf = {
            store: 'add-tax',
            api: 'taxes',
            action: 'quickPatch',
            view: 'update_tax',
            httpMethod: 'updateNested',
            method: 'genericPatch',
            successTitle: 'Edit Tax',
            successMessage: 'Tax edited',
            failedTitle: 'Edit Tax',
            failedMessage: 'Tax updating has',
        };
        service.genericNestedPatch(row, conf, table);
        expect(service.genericNestedPatch).toHaveBeenCalled();
    });

    it('should test updateFollowUp function and reset disableSubmit on success', () => {
        spyOn(service, 'updateFollowUp').and.callThrough();
        spyOn(service, 'showToast');

        const comp = {};
        service.setupComponent(comp);

        const row = {
            id: '12312',
            node: {
                id: '12312',
                dueDate: '2024-12-31',
            },
            returned_results_task: 'Task completed',
            other_reason: 'No additional notes',
        };

        const conf = {
            data: {
                status: 'completed',
            },
        };

        const siltable = {
            showModal: true,
            disableSubmit: false,
            getData: jasmine.createSpy('getData'),
        };

        service.updateFollowUp(row, conf, siltable);

        expect(service.updateFollowUp).toHaveBeenCalled();
        expect(service.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Successful',
            'Task has been completed'
        );
        expect(siltable.showModal).toBe(false);
        expect(siltable.disableSubmit).toBe(false);
        expect(siltable.getData).toHaveBeenCalled();
    });

    it('should test updateFollowUp function and reset disableSubmit on error', () => {
        spyOn(service, 'updateFollowUp').and.callThrough();
        spyOn(service.dataLayer, 'update').and.returnValue(
            throwError(() => ({ error: { message: 'Server error' } }))
        );
        spyOn(service, 'showToast');

        const comp = {};
        service.setupComponent(comp);

        const row = {
            id: '12312',
            node: {
                id: '12312',
                dueDate: '2024-12-31',
            },
            returned_results_task: 'Task completed',
            other_reason: 'No additional notes',
        };

        const conf = {
            data: {
                status: 'completed',
            },
        };

        const siltable = {
            showModal: true,
            disableSubmit: true,
            getData: jasmine.createSpy('getData'),
        };

        service.updateFollowUp(row, conf, siltable);

        expect(service.updateFollowUp).toHaveBeenCalled();
        expect(service.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Error',
            'Server error'
        );
        expect(siltable.disableSubmit).toBe(false);
        expect(siltable.showModal).toBe(true);
    });

    it('should test the mapImport method', () => {
        const model = {
            product: 'Test',
            number_of_packages: 5,
            quantity_per_package: 2,
        };

        spyOn(service, 'mapImport').and.callThrough();
        spyOn(service, 'showToast').and.callThrough();
        service.mapImport(model);
        expect(service.mapImport).toHaveBeenCalledWith(model);
    });

    it('should test the processBOM method', () => {
        const siltable = {
            selectedItem: {
                id: '1234',
            },
            getData: () => {},
        };
        const row = {};
        const conf = {};

        spyOn(service, 'processBOM').and.callThrough();
        spyOn(service, 'showToast').and.callThrough();
        service.processBOM(row, conf, siltable);
        expect(service.processBOM).toHaveBeenCalledWith(row, conf, siltable);
    });
    it('should test the submitProcessInvoice method', () => {
        const siltable = {
            selectedItem: {
                id: '1234',
            },
            getData: () => {},
        };
        const row = {};
        const conf = {};

        spyOn(service, 'submitProcessInvoice').and.callThrough();
        spyOn(service, 'showToast').and.callThrough();
        service.submitProcessInvoice(row, conf, siltable);
        expect(service.submitProcessInvoice).toHaveBeenCalledWith(
            row,
            conf,
            siltable
        );
    });
    it('should test the submitDeclineReason method', () => {
        const siltable = {
            selectedItem: {
                id: '1234',
            },
            getData: () => {},
        };
        const row = {};
        const conf = {};

        spyOn(service, 'submitDeclineReason').and.callThrough();
        spyOn(service, 'showToast').and.callThrough();
        service.submitDeclineReason(row, conf, siltable);
        expect(service.submitDeclineReason).toHaveBeenCalledWith(
            row,
            conf,
            siltable
        );
    });

    it('should test createRefund method', () => {
        const table = {
            showModal: true,
            getData: () => {},
            disableSubmit: true,
            customFxn: {
                emit: () => {},
            },
        };
        spyOn(service, 'createRefund').and.callThrough();
        service.createRefund({ invoice: 123 }, table);
        expect(service.createRefund).toHaveBeenCalled();
    });

    it('should test removeInvoiceItem method', () => {
        const table = {
            id: '123',
            getData: () => {},
        };
        spyOn(service, 'removeInvoiceItem').and.callThrough();
        service.removeInvoiceItem(table);
        expect(service.removeInvoiceItem).toHaveBeenCalled();
    });

    it('should test removeOrderItem method', () => {
        const table = {
            id: '123',
            getData: () => {},
        };
        spyOn(service, 'removeOrderItem').and.callThrough();
        service.removeOrderItem(table);
        expect(service.removeOrderItem).toHaveBeenCalled();
    });

    it('should test removeOrderAttachment method', () => {
        const table = {
            id: '123',
            getData: () => {},
        };
        spyOn(service, 'removeOrderAttachment').and.callThrough();
        service.removeOrderAttachment(table);
        expect(service.removeOrderAttachment).toHaveBeenCalled();
    });

    it('should test createMessageLogsReport method', () => {
        const cmpt = {
            downloadBtnStatus: true,
            $state: {
                go() {
                    return true;
                },
            },
        };
        spyOn(service, 'createMessageLogsReport').and.callThrough();
        service.createMessageLogsReport(cmpt, '', 'go.here');
        expect(service.createMessageLogsReport).toHaveBeenCalledWith(
            cmpt,
            '',
            'go.here'
        );
    });

    it('should test createMessageLogsReport method with delivery_type value as truthy', () => {
        const cmpt = {
            downloadBtnStatus: true,
            $state: {
                go() {
                    return true;
                },
            },
        };
        spyOn(service, 'createMessageLogsReport').and.callThrough();
        service.createMessageLogsReport(cmpt, { delivery_type: '' }, 'go.here');
        expect(service.createMessageLogsReport).toHaveBeenCalledWith(
            cmpt,
            { delivery_type: '' },
            'go.here'
        );
    });

    it('should test deleteDirectInvoiceItem method', () => {
        const row = {
            id: '1',
            product_name: 'Product 1',
        };
        const siltable = {
            showModal: false,
            disableSubmit: false,
            getData: () => {},
        };
        spyOn(service, 'deleteDirectInvoiceItem').and.callThrough();
        service.deleteDirectInvoiceItem(row, siltable);
        expect(service.deleteDirectInvoiceItem).toHaveBeenCalled();
        expect(service.deleteDirectInvoiceItem).toHaveBeenCalledWith(
            row,
            siltable
        );
    });

    it('should test the patchSupplierPaymentLine method', () => {
        const siltable = {
            selectedItem: {
                id: '1234',
            },
            showModal: true,
            disableSubmit: true,
            getData: () => {},
        };
        const row = {};
        const conf = {
            view: '/patch-supplier-payment-line',
        };

        spyOn(service, 'patchSupplierPaymentLine').and.callThrough();
        service.patchSupplierPaymentLine(row, conf, siltable);
        expect(service.patchSupplierPaymentLine).toHaveBeenCalledWith(
            row,
            conf,
            siltable
        );
    });

    it('should test the removeSupplierPaymentLine method', () => {
        const siltable = {
            selectedItem: {
                id: '1234',
            },
            getData: () => {},
        };
        const row = {
            id: '123',
        };
        const conf = {};

        spyOn(service, 'removeSupplierPaymentLine').and.callThrough();
        service.removeSupplierPaymentLine(row, conf, siltable);
        expect(service.removeSupplierPaymentLine).toHaveBeenCalledWith(
            row,
            conf,
            siltable
        );
    });

    it('should test patchPaymentMethod method', () => {
        const row = {
            id: '1',
            description: 'Changed payment method name',
        };

        const siltable = {
            showModal: true,
            disableSubmit: false,
            getData: () => {},
        };

        const conf = {};

        spyOn(service, 'patchPaymentMethod').and.callThrough();
        service.patchPaymentMethod(row, conf, siltable);
        expect(service.patchPaymentMethod).toHaveBeenCalledWith(
            row,
            conf,
            siltable
        );
    });
    /**
     * Test patchBillItem success case
     */
    it('should update bill item successfully', () => {
        const row = { id: '12312', name: 'Test Item', quantity: 10 };
        const table = {
            showModal: true,
            disableSubmit: true,
            getData: () => {},
        };

        spyOn(silStoresService, 'update').and.returnValue(of({}));
        spyOn(service, 'showToast');
        spyOn(stateService, 'reload');

        service.patchBillItem(row, null, table);

        expect(service.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Bill Item',
            'Updated bill item details'
        );
        expect(stateService.reload).toHaveBeenCalled();
        expect(table.showModal).toBe(false);
        expect(table.disableSubmit).toBe(false);
    });

    /**
     * Test removeBillItem success case
     */
    it('should remove bill item successfully', () => {
        const row = { id: '12312' };
        const table = {
            showModal: true,
            disableSubmit: true,
            getData: () => {},
        };

        spyOn(silStoresService, 'remove').and.returnValue(of({}));
        spyOn(service, 'showToast');
        spyOn(stateService, 'reload');

        service.removeBillItem(row, null, table);

        expect(service.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Remove Bill Item',
            'Removed bill item'
        );
        expect(stateService.reload).toHaveBeenCalled();
        expect(table.showModal).toBe(false);
        expect(table.disableSubmit).toBe(false);
    });

    it('should test retirePaymentMethod method', () => {
        const row = {
            id: '1',
        };

        const siltable = {
            showModal: true,
            disableSubmit: false,
            getData: () => {},
        };

        const conf = {};

        spyOn(service, 'retirePaymentMethod').and.callThrough();
        service.retirePaymentMethod(row, conf, siltable);
        expect(service.retirePaymentMethod).toHaveBeenCalledWith(
            row,
            conf,
            siltable
        );
    });

    it('should test editOpposingEntry method when entry type is credit', () => {
        const row = {
            line_amount: 35000,
            entry_type: 'cr',
        };
        const siltable = {
            showModal: true,
            getData: () => {},
            disableSubmit: false,
        };
        const conf = {};
        spyOn(service, 'editOpposingEntry').and.callThrough();
        service.editOpposingEntry(row, conf, siltable);
        expect(service.editOpposingEntry).toHaveBeenCalledWith(
            row,
            conf,
            siltable
        );
    });

    it('should test editOpposingEntry method when entry type is debit', () => {
        const row = {
            line_amount: 35000,
            entry_type: 'dr',
        };
        const siltable = {
            showModal: true,
            disableSubmit: false,
            getData: () => {},
        };
        const conf = {};
        spyOn(service, 'editOpposingEntry').and.callThrough();
        service.editOpposingEntry(row, conf, siltable);
        expect(service.editOpposingEntry).toHaveBeenCalledWith(
            row,
            conf,
            siltable
        );
    });

    it('should test patchSubtopic method', () => {
        const siltable = {
            showModal: true,
            disableSubmit: true,
            getData: () => {},
            $state: { reload: jasmine.createSpy('reload') },
        };
        const row = { id: 1 };
        const conf = {};

        spyOn(service, 'patchSubtopic').and.callThrough();

        service.patchSubtopic(row, conf, siltable);

        expect(service.patchSubtopic).toHaveBeenCalledWith(row, conf, siltable);
    });

    it('should test removeSubtopic method', () => {
        const siltable = {
            showModal: true,
            getData: () => {},
            disableSubmit: true,
            $state: { reload: jasmine.createSpy('reload') },
        };
        const row = { id: 1 };
        const conf = {};

        spyOn(service, 'removeSubtopic').and.callThrough();

        service.removeSubtopic(row, conf, siltable);

        expect(service.removeSubtopic).toHaveBeenCalledWith(
            row,
            conf,
            siltable
        );
    });

    it('should test patchTopic method', () => {
        const siltable = {
            showModal: true,
            disableSubmit: true,
            getData: () => {},
            $state: { reload: jasmine.createSpy('reload') },
        };
        const row = { id: 1 };
        const conf = {};

        spyOn(service, 'patchTopic').and.callThrough();

        service.patchTopic(row, conf, siltable);

        expect(service.patchTopic).toHaveBeenCalledWith(row, conf, siltable);
    });

    it('should test removeGuide method', () => {
        const siltable = {
            showModal: true,
            disableSubmit: true,
            getData: () => {},
            $state: { reload: jasmine.createSpy('reload') },
        };
        const row = { id: 1 };
        const conf = {};

        spyOn(service, 'removeGuide').and.callThrough();

        service.removeGuide(row, conf, siltable);

        expect(service.removeGuide).toHaveBeenCalledWith(row, conf, siltable);
    });

    it('should use conf.pricelistId if present', fakeAsync(() => {
        const row = { id: 'loc2', pricelistId: 'rowId' };
        const conf = { pricelistId: 'confId' };
        const siltable = { showModal: true, disableSubmit: true };

        spyOn(service.dataLayer, 'get').and.returnValue(
            of({ id: 'confId', locations: ['loc2'] })
        );
        spyOn(service.dataLayer, 'update').and.returnValue(of({}));
        spyOn(service, 'showToast');
        spyOn(service.$state, 'reload');

        service.removePricelistLocation(row, conf, siltable);
        tick(501);

        expect(service.dataLayer.get).toHaveBeenCalledWith(
            'pricelists',
            'confId'
        );
        expect(service.dataLayer.update).toHaveBeenCalledWith(
            'pricelists',
            'confId',
            { locations: [] }
        );
        expect(service.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Pricelist Location',
            'Removed location from pricelist'
        );
        expect(siltable.showModal).toBe(false);
        expect(siltable.disableSubmit).toBe(false);
        expect(service.$state.reload).toHaveBeenCalled();
    }));

    it('should use row.pricelistId if conf.pricelistId is missing', fakeAsync(() => {
        const row = { id: 'loc2', pricelistId: 'rowId' };
        const conf = {};
        const siltable = { showModal: true, disableSubmit: true };

        spyOn(service.dataLayer, 'get').and.returnValue(
            of({ id: 'rowId', locations: ['loc2'] })
        );
        spyOn(service.dataLayer, 'update').and.returnValue(of({}));
        spyOn(service, 'showToast');
        spyOn(service.$state, 'reload');

        service.removePricelistLocation(row, conf, siltable);
        tick(501);

        expect(service.dataLayer.get).toHaveBeenCalledWith(
            'pricelists',
            'rowId'
        );
        expect(service.dataLayer.update).toHaveBeenCalledWith(
            'pricelists',
            'rowId',
            { locations: [] }
        );
        expect(service.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Pricelist Location',
            'Removed location from pricelist'
        );
        expect(siltable.showModal).toBe(false);
        expect(siltable.disableSubmit).toBe(false);
        expect(service.$state.reload).toHaveBeenCalled();
    }));

    it('should show error toast if pricelistId is missing', () => {
        const row = { id: 'loc2' };
        const conf = {};
        const siltable = {};

        spyOn(service, 'showToast');

        service.removePricelistLocation(row, conf, siltable);

        expect(service.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Error',
            'Pricelist ID missing'
        );
    });

    it('should handle pricelist with undefined locations (empty array)', fakeAsync(() => {
        const row = { id: 'loc2', pricelistId: 'pricelist123' };
        const conf = { pricelistId: 'pricelist123' };
        const siltable = { showModal: true, disableSubmit: true };

        spyOn(service.dataLayer, 'get').and.returnValue(
            of({ id: 'pricelist123', locations: undefined })
        );
        spyOn(service.dataLayer, 'update').and.returnValue(of({}));
        spyOn(service, 'showToast');
        spyOn(service.$state, 'reload');

        service.removePricelistLocation(row, conf, siltable);
        tick(501);

        expect(service.dataLayer.update).toHaveBeenCalledWith(
            'pricelists',
            'pricelist123',
            { locations: [] }
        );
        expect(service.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Pricelist Location',
            'Removed location from pricelist'
        );
        expect(siltable.showModal).toBe(false);
        expect(siltable.disableSubmit).toBe(false);
        expect(service.$state.reload).toHaveBeenCalled();
    }));

    it('should show error toast and call errorHandler if update fails', () => {
        const row = { id: 'loc2', pricelistId: 'pricelist123' };
        const conf = { pricelistId: 'pricelist123' };
        const siltable = { showModal: true, disableSubmit: true };

        spyOn(service.dataLayer, 'get').and.returnValue(
            of({ id: 'pricelist123', locations: ['loc1', 'loc2'] })
        );
        spyOn(service.dataLayer, 'update').and.returnValue(
            throwError(() => 'update error')
        );
        spyOn(service, 'showToast');
        spyOn(service.errorHandler, 'handleError');

        service.removePricelistLocation(row, conf, siltable);

        expect(service.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Failed to remove location',
            'Remove'
        );
        expect(service.errorHandler.handleError).toHaveBeenCalledWith(
            'update error',
            service
        );
        expect(siltable.disableSubmit).toBe(false);
    });

    it('should show error toast and call errorHandler if get fails', () => {
        const row = { id: 'loc2', pricelistId: 'pricelist123' };
        const conf = { pricelistId: 'pricelist123' };
        const siltable = { showModal: true, disableSubmit: true };

        spyOn(service.dataLayer, 'get').and.returnValue(
            throwError(() => 'get error')
        );
        spyOn(service, 'showToast');
        spyOn(service.errorHandler, 'handleError');

        service.removePricelistLocation(row, conf, siltable);

        expect(service.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Failed to fetch pricelist',
            'Remove'
        );
        expect(service.errorHandler.handleError).toHaveBeenCalledWith(
            'get error',
            service
        );
        expect(siltable.disableSubmit).toBe(false);
    });

    it('should test the activateOrgFeatureMethod method', fakeAsync(() => {
        spyOn(stateService, 'reload');
        spyOn(service, 'showToast');

        const row = {
            id: '12312',
        };

        const table = {
            getData: () => {},
            selectedItem: {
                id: '1234',
            },
        };

        spyOn(service, 'activateOrgFeatureMethod').and.callThrough();
        service.activateOrgFeatureMethod(row, null, table);
        expect(service.activateOrgFeatureMethod).toHaveBeenCalled();

        expect(stateService.reload).toHaveBeenCalled();

        expect(service.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Activate Org Feature',
            'Activate org. feature successfully!'
        );
    }));

    it('should test the deactivateOrgFeatureMethod method', fakeAsync(() => {
        spyOn(stateService, 'reload');
        spyOn(service, 'showToast');

        const row = {
            id: '12312',
        };

        const table = {
            getData: () => {},
            selectedItem: {
                id: '1234',
            },
        };

        spyOn(service, 'deactivateOrgFeatureMethod').and.callThrough();
        service.deactivateOrgFeatureMethod(row, null, table);
        expect(service.deactivateOrgFeatureMethod).toHaveBeenCalled();

        expect(stateService.reload).toHaveBeenCalled();

        expect(service.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Deactivate Org Feature',
            'Deactivate org. feature successfully'
        );
    }));
});

class SilStoresServiceStub2 {
    customUpdate() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    updateNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    updateResource() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    createNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    remove() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('SilDatatableService error:', () => {
    let service: SilDatatableService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SilDatatableService,
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: () => 1, // represents the bookId
                            },
                        },
                    },
                },
                { provide: SilStoresService, useClass: SilStoresServiceStub2 },
                { provide: ItemListService, useClass: ItemListServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(SilDatatableService);
    });

    it('should test patchNextOfKin', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '1234567',
            gender: 'MALE',
            first_name: 'John',
            last_name: 'Doe',
            date_of_birth: '22-07-08',
            person_contacts: [
                {
                    contact_type: 'phone_number',
                    contact: '25412345678',
                },
                {
                    contact_type: 'phone_number',
                    contact: '12345678',
                },
            ],
            relationship: 'SIB',
            person_ids: [],
        };
        const table = {
            getData: () => {},
            data: {
                visit: 1,
            },
        };
        const conf = {
            nestedId: '1234',
        };
        spyOn(service, 'patchNextOfKin').and.callThrough();
        service.patchNextOfKin(row, conf, table);
        expect(service.patchNextOfKin).toHaveBeenCalled();
    });

    it('should test genericPost error', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const conf = {
            data: [
                { key: 'test', value: 'id' },
                { key: 'perons', value: 'person.id' },
            ],
            store: 'test',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'genericPost').and.callThrough();
        service.mineValue({ key: 'perons', value: 'person.id' }, undefined);
        service.genericPost(row, conf, table);
        expect(service.genericPost).toHaveBeenCalled();
    });

    it('should test removeRelationship error', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '1234567',
            gender: 'MALE',
            first_name: 'John',
            last_name: 'Doe',
            date_of_birth: '22-07-08',
            person_contacts: [
                { contact_type: 'phone_number', contact: '25412345678' },
            ],
            relationship: 'SIB',
            person_ids: [],
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'removeRelationship').and.callThrough();
        service.removeRelationship(row.id, null, table);
        expect(service.removeRelationship).toHaveBeenCalled();
    });

    it('should test patchAnswer error', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const conf = {
            store: 'add-tax',
            api: 'taxes',
            action: 'quickPatch',
            httpMethod: 'update',
            method: 'genericPatch',
            successTitle: 'Edit Tax',
            successMessage: 'Tax edited',
            failedTitle: 'Edit Tax',
            failedMessage: 'Tax updating has',
        };
        spyOn(service, 'patchAnswer').and.callThrough();
        service.patchAnswer(row, conf);
        expect(service.patchAnswer).toHaveBeenCalled();
    });

    it('should test patchPatient/patchAppointment/patchPractitioner error', () => {
        const row = {
            id: '12312',
            appointment_status: 'BOOKED',
            reason: 'flu',
            slot: {
                id: 1,
                start: 'now',
                end: 'later',
            },
            person: {
                email: 'test@email.com',
                id_value: '1234567',
                date_of_birth: '22-07-08',
                person_contacts: [
                    {
                        contact_type: 'phone_number',
                        contact: '+25412345678',
                        is_primary_contact: true,
                        id: '1221',
                    },
                    {
                        contact_type: 'email',
                        contact: 'test@email.com',
                        is_primary_contact: false,
                        id: '32323',
                    },
                ],
                person_ids: [{}],
                person_photos: [],
            },
        };
        const conf = {
            value: 'YES',
        };
        const table = {
            getData: () => {},
            setParams: () => {},
        };
        const comp = {};
        service.setupComponent(comp);
        spyOn(service, 'patchPatient').and.callThrough();
        service.patchPatient(row, undefined, table);
        service.patchPractitioner(row, undefined, table);
        service.patchAppointment(row, undefined, table);
        service.patchCheckinAppointment(row, undefined, table);
        service.patchSegmentMember(row, conf, table);
        service.refreshData(conf);
        expect(service.patchPatient).toHaveBeenCalled();
    });

    it('should test cancelAppointment error', () => {
        const row = {
            id: '12312',
            appointment_status: 'CANCELLED',
            reason: 'flu',
        };
        const conf = {
            value: 'YES',
        };
        const table = {
            getData: () => {},
        };
        const comp = {};
        service.setupComponent(comp);
        spyOn(service, 'cancelAppointment').and.callThrough();
        service.cancelAppointment(row, undefined, table);
        service.refreshData(conf);
        expect(service.cancelAppointment).toHaveBeenCalled();
    });

    it('should test patchQueue', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            status: 'WAITING',
        };
        const table = {
            getData: () => {},
        };
        const conf = {
            value: 'YES',
        };
        spyOn(service, 'patchQueue').and.callThrough();
        service.refreshData(conf);
        service.patchQueue(row, null, table);
        expect(service.patchQueue).toHaveBeenCalled();
    });

    it('should test patchOrgSetting error', () => {
        const row = {
            id: '12312',
            value: 'value',
            name: 'setting',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'patchOrgSetting').and.callThrough();
        service.patchOrgSetting(row, undefined, table);
        const row2 = {
            id: '12312',
            value: '12',
            name: 'setting',
        };
        service.patchOrgSetting(row2, undefined, table);
        expect(service.patchOrgSetting).toHaveBeenCalled();
    });

    it('should test patchBranchSettings error', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'patchBranchSettings').and.callThrough();
        service.patchBranchSettings(row, null, table);
        expect(service.patchBranchSettings).toHaveBeenCalled();
    });

    it('should test transitionStatus', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            status: 'ACTIVE',
        };
        const conf = {
            store: 'care-journeys',
            api: 'care-journeys',
            context: 'Retire Journey',
            patchObject: {
                status: 'RETIRED',
            },
            action: 'quickPatch',
            httpMethod: 'update',
            method: 'transitionStatus',
            title: 'Journey',
            successTitle: 'Retire Journey',
            successMessage: 'Journey retired successfully',
            failedTitle: 'Retire Journey',
            failedMessage: 'Journey retiring was unsuccessful',
            state: '',
        };
        const table = {
            getData: () => {},
            setParams: () => {},
        };
        spyOn(service, 'transitionStatus').and.callThrough();
        service.transitionStatus(row, conf, table);
        expect(service.transitionStatus).toHaveBeenCalled();
    });

    it('should test patchInvoiceLine error', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
            data: {
                visit: 1,
            },
        };
        spyOn(service, 'patchInvoiceLine').and.callThrough();
        service.visitService.visit = {
            id: 1,
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
        };
        service.patchInvoiceLine(row, null, table);
        expect(service.patchInvoiceLine).toHaveBeenCalled();
    });

    it('should test addToQueue error', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            status: 'PENDING',
        };
        const table = {
            getData: () => {},
            data: {
                visit: 1,
            },
        };
        spyOn(service, 'addToQueue').and.callThrough();
        service.visitService.visit = {
            id: 1,
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
        };
        service.addToQueue(row, null, table);
        expect(service.addToQueue).toHaveBeenCalled();
    });

    it('should test genericPatch error', () => {
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'genericPatch').and.callThrough();
        const conf = {
            store: 'add-tax',
            api: 'taxes',
            action: 'quickPatch',
            httpMethod: 'update',
            method: 'genericPatch',
            successTitle: 'Edit Tax',
            successMessage: 'Tax edited',
            failedTitle: 'Edit Tax',
            failedMessage: 'Tax updating has',
        };
        service.genericPatch(row, conf, table);
        expect(service.genericPatch).toHaveBeenCalled();
    });

    it('should test updateProductPatch error', () => {
        const row = {
            id: '12312',
            categories: [],
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'updateProductPatch').and.callThrough();
        const conf = {
            store: 'add-tax',
            api: 'taxes',
            action: 'quickPatch',
            httpMethod: 'update',
            method: 'updateProductPatch',
            successTitle: 'Edit Tax',
            successMessage: 'Tax edited',
            failedTitle: 'Edit Tax',
            failedMessage: 'Tax updating has',
        };
        service.updateProductPatch(row, conf, table);
        expect(service.updateProductPatch).toHaveBeenCalled();
    });

    it('should test patchGuidelines error', () => {
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'patchGuidelines').and.callThrough();
        service.patchGuidelines(row, undefined, table);
        expect(service.patchGuidelines).toHaveBeenCalled();
    });

    it('should test patchPrompt error', () => {
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'patchPrompt').and.callThrough();
        service.patchPrompt(row, undefined, table);
        expect(service.patchPrompt).toHaveBeenCalled();
    });

    it('should test patchDisease error', () => {
        const clinicalGuidelineIds = ['123'];
        const patientGuidelineIds = ['123'];

        const row = {
            area: { id: '123', name: 'malaria' },
            disease: { display_name: 'malaria' },
            clinical_guidelines: [clinicalGuidelineIds],
            patient_guidelines: [patientGuidelineIds],
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'patchDisease').and.callThrough();
        service.patchDisease(row, undefined, table);
        expect(service.patchDisease).toHaveBeenCalled();
    });

    it('should test patchPatientGuidelines', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'patchPatientGuidelines').and.callThrough();
        service.patchPatientGuidelines(row, null, table);
        expect(service.patchPatientGuidelines).toHaveBeenCalled();
    });

    it('should test genericNestedPatch', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'genericNestedPatch').and.callThrough();
        const conf = {
            store: 'add-tax',
            api: 'taxes',
            action: 'quickPatch',
            view: 'update_tax',
            httpMethod: 'updateNested',
            method: 'genericPatch',
            successTitle: 'Edit Tax',
            successMessage: 'Tax edited',
            failedTitle: 'Edit Tax',
            failedMessage: 'Tax updating has',
        };
        service.genericNestedPatch(row, conf, table);
        expect(service.genericNestedPatch).toHaveBeenCalled();
    });

    it('should test removeInvoiceLine & refundPayment error', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            invoice: '1',
        };
        const table = {
            getData: () => {},
            data: {
                visit: 1,
            },
            customFxn: {
                emit: () => {},
            },
        };
        spyOn(service, 'removeInvoiceLine').and.callThrough();
        spyOn(service, 'refundInvoiceLine').and.callThrough();
        spyOn(service, 'refundPayment').and.callThrough();
        service.visitService.visit = {
            id: 1,
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
        };
        service.removeInvoiceLine(row, null, table);
        service.refundInvoiceLine(row, null, table);
        service.refundPayment(row, null, table);
        expect(service.removeInvoiceLine).toHaveBeenCalled();
        expect(service.refundPayment).toHaveBeenCalled();
    });

    it('should test patchProduct error', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'patchProduct').and.callThrough();
        service.patchProduct(row, null, table);
        expect(service.patchProduct).toHaveBeenCalled();
    });

    it('should test patchReturnItem error', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'patchReturnItem').and.callThrough();
        service.patchReturnItem(row, null, table);
        expect(service.patchReturnItem).toHaveBeenCalled();
    });

    it('should test patchDirectPurchaseOrder', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'patchDirectPurchaseOrder').and.callThrough();
        service.patchDirectPurchaseOrder(row, null, table);
        expect(service.patchDirectPurchaseOrder).toHaveBeenCalled();
    });

    it('should test removeReturnOutwardsLine', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'removeReturnOutwardsLine').and.callThrough();
        service.removeReturnOutwardsLine(row, null, table);
        expect(service.removeReturnOutwardsLine).toHaveBeenCalled();
    });

    it('should test removeDirectPurchaseOrderLine', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
        };
        spyOn(service, 'removeDirectPurchaseOrderLine').and.callThrough();
        service.removeDirectPurchaseOrderLine(row, null, table);
        expect(service.removeDirectPurchaseOrderLine).toHaveBeenCalled();
    });

    it('should test patchTransferItem error', fakeAsync(() => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
            selectedItem: {
                id: '1234',
            },
        };
        spyOn(service, 'patchTransferItem').and.callThrough();
        service.patchTransferItem(row, null, table);
        tick(3200);
        expect(service.patchTransferItem).toHaveBeenCalled();
    }));

    it('should test removeTransferItem error', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
            inventory_operation: '1234',
        };
        const table = {
            getData: () => {},
            selectedItem: {
                id: '1234',
            },
        };
        spyOn(service, 'removeTransferItem').and.callThrough();
        service.removeTransferItem(row, null, table);
        expect(service.removeTransferItem).toHaveBeenCalled();
    });

    it('should test the mapImport method', () => {
        const model = {
            product: 'Test',
            number_of_packages: 5,
            quantity_per_package: 2,
        };

        spyOn(service, 'mapImport').and.callThrough();
        spyOn(service, 'showToast').and.callThrough();
        service.mapImport(model);
        expect(service.mapImport).toHaveBeenCalledWith(model);
    });

    it('should test patchAdjustmentItem error', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
            selectedItem: {
                id: '1234',
            },
        };
        spyOn(service, 'patchAdjustmentItem').and.callThrough();
        service.patchAdjustmentItem(row, null, table);
        expect(service.patchAdjustmentItem).toHaveBeenCalled();
    });

    it('should test removeAdjustmentItem error', () => {
        const comp = {};
        service.setupComponent(comp);

        const row = { id: '1234' };
        const conf = {};
        const siltable = {
            showModal: true,
            disableSubmit: true,
            getData: jasmine.createSpy('getData'),
        };
        spyOn(service, 'showToast');
        spyOn(service.errorHandler, 'handleError');

        service.removeAdjustmentItem(row, conf, siltable);

        expect(service.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Delete Item',
            'Failed to delete adjustment item'
        );
        expect(service.errorHandler.handleError).toHaveBeenCalled();
        expect(siltable.disableSubmit).toBe(false);
    });

    it('should test patchRequestedProduct error', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = {
            id: '12312',
        };
        const table = {
            getData: () => {},
            selectedItem: {
                id: '1234',
            },
        };
        spyOn(service, 'patchRequestedProduct').and.callThrough();
        service.patchRequestedProduct(row, null, table);
        expect(service.patchRequestedProduct).toHaveBeenCalled();
    });

    it('should test removeRequestedProduct error', () => {
        const comp = {};
        service.setupComponent(comp);

        const siltable = {
            id: '1234',
            getData: () => {},
        };
        spyOn(service, 'removeRequestedProduct').and.callThrough();
        service.removeRequestedProduct(siltable);
        expect(service.removeRequestedProduct).toHaveBeenCalled();
    });

    it('should handle error in removePricelistProduct', () => {
        const comp = {};
        service.setupComponent(comp);
        const row = { id: '12345' };
        const conf = {};
        const siltable = {
            showModal: true,
            disableSubmit: true,
            getData: jasmine.createSpy('getData'),
        };
        spyOn(service.dataLayer, 'remove').and.returnValue(
            throwError(() => 'remove error')
        );
        spyOn(service, 'showToast');
        spyOn(service.errorHandler, 'handleError');
        service.removePricelistProduct(row, conf, siltable);
        expect(service.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Failed to remove product from pricelist',
            'Remove Pricelist Product'
        );
        expect(service.errorHandler.handleError).toHaveBeenCalledWith(
            'remove error',
            service
        );
        expect(siltable.disableSubmit).toBe(false);
    });

    it('should test removeRequisitionAttachment error', () => {
        const comp = {};
        service.setupComponent(comp);

        const siltable = {
            id: '1234',
            getData: () => {},
        };
        spyOn(service, 'removeRequisitionAttachment').and.callThrough();
        service.removeRequisitionAttachment(siltable);
        expect(service.removeRequisitionAttachment).toHaveBeenCalled();
    });

    it('should test the processBOM method', () => {
        const siltable = {
            selectedItem: {
                id: '1234',
            },
            getData: () => {},
        };
        const row = {};
        const conf = {};

        spyOn(service, 'processBOM').and.callThrough();
        spyOn(service, 'showToast').and.callThrough();
        service.processBOM(row, conf, siltable);
        expect(service.processBOM).toHaveBeenCalledWith(row, conf, siltable);
    });

    it('should test the submitProcessInvoice method', () => {
        const siltable = {
            selectedItem: {
                id: '1234',
            },
            getData: () => {},
        };
        const row = {};
        const conf = {};

        spyOn(service, 'submitProcessInvoice').and.callThrough();
        spyOn(service, 'showToast').and.callThrough();
        service.submitProcessInvoice(row, conf, siltable);
        expect(service.submitProcessInvoice).toHaveBeenCalledWith(
            row,
            conf,
            siltable
        );
    });
    it('should test the submitDeclineReason method', () => {
        const siltable = {
            selectedItem: {
                id: '1234',
            },
            getData: () => {},
        };
        const row = {};
        const conf = {};

        spyOn(service, 'submitDeclineReason').and.callThrough();
        spyOn(service, 'showToast').and.callThrough();
        service.submitDeclineReason(row, conf, siltable);
        expect(service.submitDeclineReason).toHaveBeenCalledWith(
            row,
            conf,
            siltable
        );
    });

    it('should test createRefund method error path', () => {
        const table = {
            showModal: true,
            getData: () => {},
            disableSubmit: true,
            customFxn: {
                emit: () => {},
            },
        };
        spyOn(service, 'createRefund').and.callThrough();
        service.createRefund({ invoice: 123 }, table);
        expect(service.createRefund).toHaveBeenCalled();
    });

    it('should test removeInvoiceItem method', () => {
        const table = {
            id: '123',
            getData: () => {},
        };
        spyOn(service, 'removeInvoiceItem').and.callThrough();
        service.removeInvoiceItem(table);
        expect(service.removeInvoiceItem).toHaveBeenCalled();
    });

    it('should test removeOrderItem method', () => {
        const table = {
            id: '123',
            getData: () => {},
        };
        spyOn(service, 'removeOrderItem').and.callThrough();
        service.removeOrderItem(table);
        expect(service.removeOrderItem).toHaveBeenCalled();
    });

    it('should test removeOrderAttachment method', () => {
        const table = {
            id: '123',
        };
        spyOn(service, 'removeOrderAttachment').and.callThrough();
        service.removeOrderAttachment(table);
        expect(service.removeOrderAttachment).toHaveBeenCalled();
    });

    it('should test deleteDirectInvoiceItem method', () => {
        const row = {
            id: '1',
            product_name: 'Product 1',
        };
        const siltable = {
            showModal: false,
            disableSubmit: false,
            getData: () => {},
        };
        spyOn(service, 'deleteDirectInvoiceItem').and.callThrough();
        service.deleteDirectInvoiceItem(row, siltable);
        expect(service.deleteDirectInvoiceItem).toHaveBeenCalled();
        expect(service.deleteDirectInvoiceItem).toHaveBeenCalledWith(
            row,
            siltable
        );
    });

    it('should test the patchSupplierPaymentLine method', () => {
        const siltable = {
            selectedItem: {
                id: '1234',
            },
            showModal: true,
            getData: () => {},
            disableSubmit: true,
        };
        const row = {};
        const conf = {
            view: '/patch-supplier-payment-line',
        };

        spyOn(service, 'patchSupplierPaymentLine').and.callThrough();
        service.patchSupplierPaymentLine(row, conf, siltable);
        expect(service.patchSupplierPaymentLine).toHaveBeenCalledWith(
            row,
            conf,
            siltable
        );
    });

    it('should test the removeSupplierPaymentLine method', () => {
        const siltable = {
            selectedItem: {
                id: '1234',
            },
            getData: () => {},
        };
        const row = {
            id: '123',
        };
        const conf = {};

        spyOn(service, 'removeSupplierPaymentLine').and.callThrough();
        service.removeSupplierPaymentLine(row, conf, siltable);
        expect(service.removeSupplierPaymentLine).toHaveBeenCalledWith(
            row,
            conf,
            siltable
        );
    });

    it('should test patchPaymentMethod method', () => {
        const row = {
            id: '1',
            description: 'Changed payment method name',
        };

        const siltable = {
            showModal: true,
            disableSubmit: false,
            getData: () => {},
        };

        const conf = {};

        spyOn(service, 'patchPaymentMethod').and.callThrough();
        service.patchPaymentMethod(row, conf, siltable);
        expect(service.patchPaymentMethod).toHaveBeenCalledWith(
            row,
            conf,
            siltable
        );
    });

    it('should test the removeBillItem method', () => {
        const siltable = {
            selectedItem: {
                id: '1234',
            },
            getData: () => {},
        };
        const row = {
            id: '123',
        };
        const conf = {};

        spyOn(service, 'removeBillItem').and.callThrough();

        service.removeBillItem(row, conf, siltable);

        expect(service.removeBillItem).toHaveBeenCalledWith(
            row,
            conf,
            siltable
        );
    });

    it('should test patchBillItem method', () => {
        const row = {
            id: '1',
            description: 'Changed bill item details',
        };

        const siltable = {
            showModal: true,
            disableSubmit: false,
            getData: () => {},
        };

        const conf = {};

        spyOn(service, 'patchBillItem').and.callThrough();

        service.patchBillItem(row, conf, siltable);

        expect(service.patchBillItem).toHaveBeenCalledWith(row, conf, siltable);
    });

    it('should test retirePaymentMethod method', () => {
        const row = {
            id: '1',
        };

        const siltable = {
            showModal: true,
            disableSubmit: false,
            getData: () => {},
        };

        const conf = {};

        spyOn(service, 'retirePaymentMethod').and.callThrough();
        service.retirePaymentMethod(row, conf, siltable);
        expect(service.retirePaymentMethod).toHaveBeenCalledWith(
            row,
            conf,
            siltable
        );
    });

    it('should test editOpposingEntry method when entry type is credit', () => {
        const row = {
            line_amount: 35000,
            entry_type: 'cr',
        };
        const siltable = {
            showModal: true,
            disableSubmit: false,
            getData: () => {},
        };
        const conf = {};
        spyOn(service, 'editOpposingEntry').and.callThrough();
        service.editOpposingEntry(row, conf, siltable);
        expect(service.editOpposingEntry).toHaveBeenCalledWith(
            row,
            conf,
            siltable
        );
    });

    it('should test editOpposingEntry method when entry type is debit', () => {
        const row = {
            line_amount: 35000,
            entry_type: 'dr',
        };
        const siltable = {
            showModal: true,
            disableSubmit: false,
            getData: () => {},
        };
        const conf = {};
        spyOn(service, 'editOpposingEntry').and.callThrough();
        service.editOpposingEntry(row, conf, siltable);
        expect(service.editOpposingEntry).toHaveBeenCalledWith(
            row,
            conf,
            siltable
        );
    });

    it('should test patchSubtopic method', () => {
        const siltable = {
            showModal: true,
            disableSubmit: true,
            $state: { reload: jasmine.createSpy('reload') },
        };
        const row = { id: 1 };
        const conf = {};

        spyOn(service, 'patchSubtopic').and.callThrough();

        service.patchSubtopic(row, conf, siltable);

        expect(service.patchSubtopic).toHaveBeenCalledWith(row, conf, siltable);
    });

    it('should test removeSubtopic method', () => {
        const siltable = {
            showModal: true,
            disableSubmit: true,
            getData: () => {},
            $state: { reload: jasmine.createSpy('reload') },
        };
        const row = { id: 1 };
        const conf = {};

        spyOn(service, 'removeSubtopic').and.callThrough();

        service.removeSubtopic(row, conf, siltable);

        expect(service.removeSubtopic).toHaveBeenCalledWith(
            row,
            conf,
            siltable
        );
    });

    it('should test patchTopic method', () => {
        const siltable = {
            showModal: true,
            disableSubmit: true,
            getData: () => {},
            $state: { reload: jasmine.createSpy('reload') },
        };
        const row = { id: 1 };
        const conf = {};

        spyOn(service, 'patchTopic').and.callThrough();

        service.patchTopic(row, conf, siltable);

        expect(service.patchTopic).toHaveBeenCalledWith(row, conf, siltable);
    });

    it('should test removeGuide method', () => {
        const siltable = {
            showModal: true,
            getData: () => {},
            disableSubmit: true,
            $state: { reload: jasmine.createSpy('reload') },
        };
        const row = { id: 1 };
        const conf = {};

        spyOn(service, 'removeGuide').and.callThrough();

        service.removeGuide(row, conf, siltable);

        expect(service.removeGuide).toHaveBeenCalledWith(row, conf, siltable);
    });

    it('should test the activateOrgFeatureMethod method', fakeAsync(() => {
        const row = {
            id: '12312',
        };

        const table = {
            getData: () => {},
            selectedItem: {
                id: '1234',
            },
        };

        spyOn(service, 'activateOrgFeatureMethod').and.callThrough();
        service.activateOrgFeatureMethod(row, null, table);
        expect(service.activateOrgFeatureMethod).toHaveBeenCalled();
    }));

    it('should test the deactivateOrgFeatureMethod method', fakeAsync(() => {
        const row = {
            id: '12312',
        };

        const table = {
            getData: () => {},
            selectedItem: {
                id: '1234',
            },
        };

        spyOn(service, 'deactivateOrgFeatureMethod').and.callThrough();
        service.deactivateOrgFeatureMethod(row, null, table);
        expect(service.deactivateOrgFeatureMethod).toHaveBeenCalled();
    }));
});
