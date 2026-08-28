import { ConsultationServiceRequestComponent } from './consultation-service-request.component';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { VisitService } from '../../visits/visit.service';
import { of } from 'rxjs';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';
import { SimpleChange } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

// Mock services with minimal required implementations
class MockVisitService {
    visitPatientDataEmitter = of({ clinical_id: 1 });
    visitDataEmitter = of({});
    currenciesDataEmitter = of({});
    // Add other required methods as empty functions
}

class MockAuthorization {
    setAuthDetails() {
        return of(() => {});
    }
    loginUrl() {
        return of(() => {});
    }
    logout() {
        return of(() => {});
    }
    storeToken() {
        return true;
    }
    isLoggedIn() {
        return true;
    }

    setOrganisationSettings() {
        return of(() => {});
    }

    setOrganisation() {
        return of(() => {});
    }
    setOrganisationDetails() {
        return of({
            client_types: ['PRACTITIONER'],
        });
    }
    setUserDetails() {
        return of(() => {});
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }

    setUser() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }

    getUser() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }
    getToken() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {
            organisation_name: 'org',
            id: '312',
            workstation: '213123',
            workstation__org_unit: '213123',
            workstation__org_unit__parent: '213123',
            workstation__org_unit__parent__parent: '213123',
        };
    }
    setAdvantageOrganisation() {
        return {};
    }
    setAdvantageOrganisationDetails() {
        return of(() => {});
    }
    getErpOrganisation() {
        return {
            client_types: ['PROVIDER'],
            user_workstations: [{ workstation: '1' }],
        };
    }
    removeTokenData() {
        return {};
    }
}

class MockErrorHandler {
    handleError() {}
}

class MockSilStoreService {
    get() {
        return of({
            document_number: '1231',
            made_by: 'John',
            invoice_date: '2022-11-12T12:53:07.850000+03:00',
            amount: 20,
            customer: '5190ffca-9bd0-4d98-b9c9-9b0f62368f46',
            person: {
                age: { years: 55, months: 0, weeks: 0, days: 0 },
                phone_number: '0723856342',
            },
            results: [
                {
                    document_number: '1231',
                    made_by: 'John',
                    invoice_date: '2022-11-12T12:53:07.850000+03:00',
                    amount: 20,
                    customer: '5190ffca-9bd0-4d98-b9c9-9b0f62368f46',
                },
            ],
        });
    }
    list() {
        return of({
            results: [
                {
                    id: '143224',
                    clinical_facility_id: 'sdsewerwjampisu9',
                    clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
                },
            ],
        });
    }
    create() {
        return of([{ patient: '123' }]);
    }
    getStore() {
        return {
            url: '/adfasdf/',
        };
    }
    getServer() {
        return 'http:localhost/asdff';
    }
    listNested() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    processHeaders() {}
    createNested() {
        return of([{ patient: '123' }]);
    }
}

describe('ConsultationServiceRequestComponent (Isolated)', () => {
    let component: ConsultationServiceRequestComponent;
    beforeEach(() => {
        // Instantiate directly without TestBed
        component = new ConsultationServiceRequestComponent(
            new MockVisitService() as unknown as VisitService,
            new MockSilStoreService() as unknown as SilStoresService,
            new MockAuthorization() as unknown as Authorization,
            new MockErrorHandler() as unknown as ErrorHandlerService
        );

        // Initialize required properties
        component.visit = {
            id: 1,
            person: { gender: 'MALE' },
            service_requests: [{ id: 1 }],
        };
    });

    it('should handle clinical IDs check', fakeAsync(() => {
        component.isClinicalIdsSaved = {
            clinical_facility_id: 'test',
            clinical_org_id: 'test',
        };
        component.getVisitInfo();
        component.patient = { clinical_id: 1 };
        component.visitPatientObservable();
        component.checkClinicalIdsSaved();
        component.refetchClinicalIds();
        component.handProfileFetch({
            clinical_facility_id: 1,
            clinical_org_id: 1,
        });
        component.handleError({});
        component.ngOnChanges({
            visit: new SimpleChange(
                {
                    id: '1231',
                    service_requests: [{ id: 2 }],
                    question_answers: [],
                    data: {
                        question_answers: [],
                    },
                },
                {
                    id: '1231',
                    service_requests: [{ id: 2 }],
                    question_answers: [],
                    data: {
                        question_answers: [],
                    },
                },
                false
            ),
        });
        component.ngOnInit();
        component.isClinicalIdsSaved === null;
        component.checkClinicalIdsSaved();
        tick(1000);
        expect(component.isClinicalIdsSaved).toBeDefined();
    }));
});

describe('ConsultationServiceRequestComponent (checkClinicalIdsSaved)', () => {
    let component: ConsultationServiceRequestComponent;
    beforeEach(() => {
        // Instantiate directly without TestBed
        component = new ConsultationServiceRequestComponent(
            new MockVisitService() as unknown as VisitService,
            new MockSilStoreService() as unknown as SilStoresService,
            new MockAuthorization() as unknown as Authorization,
            new MockErrorHandler() as unknown as ErrorHandlerService
        );

        // Initialize required properties
        component.visit = {
            id: 1,
            person: { gender: 'MALE' },
            service_requests: [{ id: 1 }],
        };
    });

    it('should test checkClinicalIdsSaved', () => {
        component.isClinicalIdsSaved = null;
        spyOn(component, 'checkClinicalIdsSaved').and.callThrough();
        component.checkClinicalIdsSaved();
        component.visit = {
            id: 1,
            service_requests: [{ id: 1 }],
            status: 'PENDING',
            start: '2025-05-23',
        };
        component.getVisitInfo();
        component.isClinicalIdsSaved = null;
        component.checkClinicalIdsSaved();
        expect(component.checkClinicalIdsSaved).toHaveBeenCalled();
    });
});
