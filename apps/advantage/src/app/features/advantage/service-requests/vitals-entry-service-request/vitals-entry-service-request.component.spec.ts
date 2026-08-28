import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';

import { VitalsEntryServiceRequestComponent } from './vitals-entry-service-request.component';
import { of, Subject } from 'rxjs';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { StateService } from '@uirouter/angular';
import {
    NbDialogRef,
    NbDialogService,
    NbFocusMonitor,
    NbIconLibraries,
    NbStatusService,
    NbToastrService,
} from '@nebular/theme';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { SimpleChange } from '@angular/core';
import { VisitService } from '../../visits/visit.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

class AuthorizationConfigStub {
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

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    includes() {
        return true;
    }
}

const subcribe = {
    subscribe: () => {
        return {};
    },
};

const obj = {
    onClose: subcribe,
};

class NbStatusServiceStub {
    isCustomStatus() {}
    monitor() {
        return of(() => {});
    }
    open() {
        return obj;
    }
    getIcon() {}
    getPack() {}
    registerSvgPack() {}
    setDefaultPack() {}
    connectedTo() {}
    build() {}
    close() {}
    getDirection() {}
    subscribeOnTriggers() {}
    trigger() {}
    host() {}
    container() {}
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class SilStoresServiceStub {
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

const visitServiceStub = {
    visitPatientDataEmitter: new Subject(),
    visitDataEmitter: of({
        id: '123232',
    }),
    currenciesDataEmitter: of({
        results: {
            new_price: 18,
            amount: '18',
            product_name: 'Lipid',
            quantity: 1,
            id: 1,
        },
    }),
    sendToQueue: () => {},
    completeVisit: () => {},
    queuesDataEmitter: of([
        {
            id: 1,
        },
    ]),
    fetchVisit: () => {},
    addToQueue: () => {},
    setVisitData: () => {},
    visit: {
        id: 1,
    },
};

describe('VitalsEntryServiceRequestComponent', () => {
    let component: VitalsEntryServiceRequestComponent;
    let fixture: ComponentFixture<VitalsEntryServiceRequestComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VitalsEntryServiceRequestComponent],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: Authorization,
                    useClass: AuthorizationConfigStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: NbFocusMonitor, useClass: NbStatusServiceStub },
                { provide: NbDialogRef, useClass: NbStatusServiceStub },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: NbDialogService, useClass: NbStatusServiceStub },
                { provide: NbIconLibraries, useClass: NbStatusServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub,
                },
                { provide: VisitService, useValue: visitServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(VitalsEntryServiceRequestComponent);
        component = fixture.componentInstance;
        component.visit = {
            id: 1,
            person: { gender: 'MALE' },
            service_requests: [
                { active: true, service: 'one' },
                { active: false, service: 'two' },
            ],
        };
        fixture.detectChanges();
    });

    it('should create component', () => {
        component.ngOnInit();
        component.ngOnChanges({
            visit: undefined,
        });
        component.ngOnChanges({
            visit: new SimpleChange(
                { id: '123123', service_requests: [] },
                {},
                false
            ),
        });
        component.refetchClinicalIds();
        component.handProfileFetch({
            clinical_facility_id: 1,
            clinical_org_id: 2,
        });
        expect(component.visit).toBeTruthy();
    });

    it('should test oninit without facility id', () => {
        component.isClinicalIdsSaved = localStorage.setItem(
            'auth.config.clinicalIds',
            JSON.stringify({
                clinical_facility_id: null,
                clinical_org_id: '2348923403',
            })
        );
        component.checkClinicalIdsSaved();
        expect(component).toBeTruthy();
    });
    it('should test oninit with clinical_facility_id and clinical_org_id', fakeAsync(() => {
        component.isClinicalIdsSaved = {
            clinical_facility_id: '2348923403',
            clinical_org_id: '2348923403',
        };
        component.visitPatientObservable();
        component.visitService.visitPatientDataEmitter.next({
            new_price: 18,
            clinical_id: 12,
            amount: '18',
            product_name: 'Lipid',
            quantity: 1,
            id: 1,
        });
        component.handleError({});
        component.receivePatient({ clinical_id: 1 });
        component.checkClinicalIdsSaved();
        tick(900);
        expect(component).toBeTruthy();
    }));
});
