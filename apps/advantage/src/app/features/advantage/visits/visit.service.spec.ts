import { VisitService } from './visit.service';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject, of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { RouterTestingModule } from '@angular/router/testing';
import { DataLayerUtils } from '../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../app-config.service';
import { Authorization } from '../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { StateService } from '@uirouter/angular';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

class SilStoresServiceStub {
    customUpdate() {
        return of({
            results: [
                {
                    id: 1,
                },
            ],
        });
    }
    update() {
        return of({
            id: 12,
        });
    }
    create() {
        return of({
            id: 12,
        });
    }
    get() {
        return of({
            id: 12,
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
    listNestedDownload() {
        return of({
            id: 12,
        });
    }
    list() {
        return of({
            id: 12,
            results: [{ id: '1' }],
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
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
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
    getWorkstation() {
        return {};
    }
    getOrganisation() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
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

describe('VisitService', () => {
    let service: VisitService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                VisitService,
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
                        queryParams: of({ id: 123 }),
                    },
                },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(VisitService);
    });

    it('should fetching patient information using visit details', () => {
        const comp = {
            loading: false,
            patient: '2',
            invoices: [
                {
                    sales_invoice_id: '1',
                },
            ],
        };
        spyOn(service, 'getVisitPatient').and.callThrough();
        service.getVisitPatient(comp);
        service.visit = {
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
        service.sendToQueue('12', comp);
        service.addToQueue('PENDING', '12');
        expect(service.getVisitPatient).toHaveBeenCalled();
    });

    it('should test printEntireInvoice', () => {
        spyOn(service, 'printEntireInvoice').and.callThrough();
        service.visit = {
            id: '1',
        };
        spyOn(window, 'open').and.returnValue(null);
        service.printEntireInvoice();
        expect(service.printEntireInvoice).toHaveBeenCalledWith();
    });

    it('should test fetching the visit information', () => {
        service.visit = {
            id: 1,
        };
        spyOn(service, 'fetchVisit').and.callThrough();
        service.fetchVisit();
        expect(service.fetchVisit).toHaveBeenCalled();
    });

    it('should test creating service request', () => {
        service.visit = {
            id: 1,
        };
        spyOn(service, 'addServiceRequest').and.callThrough();
        const comp = {
            visit: {
                id: 1,
            },
        };
        service.addServiceRequest(1, comp);
        expect(service.addServiceRequest).toHaveBeenCalled();
    });

    it('should test setting current doctor filtered queue', () => {
        service.prevPractitionerFilteredQueueUrl = {
            id: 1,
        };
        const practictionerFilteredQueueUrl = { id: 1 };
        spyOn(service, 'setCurrentDoctorFilteredQueue').and.callThrough();
        service.setCurrentDoctorFilteredQueue(practictionerFilteredQueueUrl);
        expect(service.setCurrentDoctorFilteredQueue).toHaveBeenCalled();
    });

    it('should test refetching patient chronic condition', () => {
        spyOn(service, 'reFetchChronicCondition').and.callThrough();
        service.reFetchChronicCondition('RECURRENCE');
        expect(service.reFetchChronicCondition).toHaveBeenCalled();
    });
});

class StateServiceStub2 {
    reload() {
        return true;
    }
    includes() {
        return false;
    }
    go() {
        return false;
    }
}

describe('VisitService test state.include', () => {
    let service: VisitService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                VisitService,
                { provide: StateService, useClass: StateServiceStub2 },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                    },
                },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(VisitService);
    });

    it('should test else branch for state.include method', () => {
        spyOn(service, 'sendToQueue').and.callThrough();
        service.visit = {
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
        const comp = {
            loading: false,
        };
        service.isVisit = false;
        service.sendToQueue('12', comp);
        expect(service.sendToQueue).toHaveBeenCalled();
    });

    it('should test fetching the visit information', () => {
        service.visit = {
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
        spyOn(service, 'fetchVisit').and.callThrough();
        service.fetchVisit();
        expect(service.fetchVisit).toHaveBeenCalled();
    });

    it('should test the updateVisit function', () => {
        spyOn(service, 'updateVisit').and.callThrough();
        service.updateVisit({
            id: 1,
            status: 'IN_PROGRESS',
        });
        expect(service.updateVisit).toHaveBeenCalled();
    });
});

class SilStoresServiceStubSuccess {
    get() {
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
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    listNestedDownload() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('VisitService error', () => {
    let service: VisitService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                VisitService,
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
                        queryParams: of({ id: 123 }),
                    },
                },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubSuccess,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(VisitService);
    });

    it('should test printEntireInvoice', () => {
        spyOn(service, 'printEntireInvoice').and.callThrough();
        service.visit = {
            id: '1',
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
        service.printEntireInvoice();
        expect(service.printEntireInvoice).toHaveBeenCalledWith();
    });

    it('should test fetching the visit information', () => {
        service.visit = {
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

        const comp = {
            loading: false,
        };

        spyOn(service, 'fetchVisit').and.callThrough();
        spyOn(service, 'getVisitPatient').and.callThrough();
        service.fetchVisit();
        service.getVisitPatient({ patient: '12' });
        service.sendToQueue('12', comp);
        service.addToQueue('PENDING', '12');
        expect(service.getVisitPatient).toHaveBeenCalled();
    });

    it('should test creating service request', () => {
        service.visit = {
            id: 1,
        };
        spyOn(service, 'addServiceRequest').and.callThrough();
        const comp = {
            visit: {
                id: 1,
            },
        };
        service.addServiceRequest(1, comp);
        expect(service.addServiceRequest).toHaveBeenCalled();
    });

    it('should test the setVisitScreeningServicePoints method', () => {
        const serviceRequests = [
            {
                id: '77c71880-e344-4567-951d-78d49a95b27a',
                queue_name: 'Breast Cancer Screening',
                queue_type: 'BREAST CANCER SCREENING',
                patient_name: 'Beatrice Maina Njeri',
                encounter_id: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                previous_point: 'Triage',
                active: true,
                status: 'COMPLETED',
                visit: 'e3b071b5-8c9b-4be7-a79c-6d3916592483',
                queue: '25860b81-b39e-409e-b102-26c6bfe3f6eb',
            },

            {
                id: 'e3175075-382f-44bd-a25b-493a5e7e974f',
                queue_name: 'Cervical Cancer Screening',
                queue_type: 'CERVICAL CANCER SCREENING',
                patient_name: 'Beatrice Maina Njeri',
                previous_point: 'Triage',
                encounter_id: 'e36fbc2f-a03e-4e9c-9080-af8a9817539e',
                active: true,
                status: 'IN_PROGRESS',
                visit: 'e3b071b5-8c9b-4be7-a79c-6d3916592483',
                queue: '6e5e237f-7d12-42a5-a969-68be05df7926',
            },
        ];
        spyOn(service, 'setVisitScreeningServicePoints').and.callThrough();

        service.setVisitScreeningServicePoints(serviceRequests);
        expect(service.setVisitScreeningServicePoints).toHaveBeenCalled();
        expect(service.screeningServicePoints).toBeDefined();
    });
});
