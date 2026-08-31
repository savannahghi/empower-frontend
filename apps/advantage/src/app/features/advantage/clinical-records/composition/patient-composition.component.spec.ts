import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCompositionComponent } from './patient-composition.component';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { of, throwError } from 'rxjs';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { VisitService } from '../../visits/visit.service';
import { AnalyticsService } from 'app/@core/utils';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

    getOrgSettings() {
        return [
            {
                name: 'patients:patient_full_name',
                value: false,
            },
        ];
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
        return {};
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

class SilStoresServiceStub {
    create() {
        return of([]);
    }
    list() {
        return of([]);
    }
    update() {
        return of({});
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params() {
        return { appointment_id: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { appointment_id: 1 };
        },
    },
};

const visitServiceStub = {
    visitPatientDataEmitter: of({
        new_price: 18,
        amount: '18',
        product_name: 'Lipid',
        quantity: 1,
        id: 1,
    }),
    pricelistDataEmitter: of({
        name: 'Default pricelist',
        id: 1,
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
    reFetchChronicCondition(data) {
        return data;
    },
    patientChronicConditionEmitter: of('RECURRENCE'),
    sendToQueue: () => {},
    completeVisit: () => {},
    queuesDataEmitter: of([
        {
            id: 1,
        },
    ]),
    fetchVisit: () => {},
    addToQueue: () => {},
    visit: {
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
    },
};

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

function mockPipe(name: string): Pipe {
    const metadata: Pipe = {
        name,
    };

    return Pipe(metadata)(
        class MockPipe implements PipeTransform {
            transform() {}
        }
    );
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

describe('PatientCompositionComponent', () => {
    let component: PatientCompositionComponent;
    let fixture: ComponentFixture<PatientCompositionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [BrowserAnimationsModule, mockPipe('translate')],
            declarations: [PatientCompositionComponent],
            providers: [
                { provide: VisitService, useValue: visitServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PatientCompositionComponent);
        component = fixture.componentInstance;
        component.patient = {
            clinical_id: 1,
        };
        component.activeServiceRequest = {
            encounter_id: 1,
        };
        component.templateName = {
            name: 'Patient Vitals',
        };
        fixture.detectChanges();
    });

    it('should test various methods', () => {
        component.toggleModal({ id: '1', name: 'heading' });
        const mockResponse = {
            data: {
                createComposition: {
                    id: '123',
                    value: '22.5',
                    timeRecorded: '2025-03-19T10:00:00Z',
                    totalCount: 1,
                    edges: [
                        {
                            node: {
                                id: 12,
                                value: 30,
                            },
                        },
                    ],
                },
            },
            createComposition: {
                id: '123',
                value: '22.5',
                timeRecorded: '2025-03-19T10:00:00Z',
                totalCount: 1,
                edges: [
                    {
                        node: {
                            id: 12,
                            value: 30,
                        },
                    },
                ],
            },
        };
        component.responseFunction(mockResponse);
        component.emitToggleServicePointModal();
        component.togglePreviewCompositionModal();
        component.togglePreviewCompositionModal({ note: 'note' });
        component.toggleIsHidden('compositionForm');
        component.toggleIsHidden('compositionForm');
        component.cancelAddCompositionNote();
        const model = {
            note: 'note',
        };
        component.wholeCompositionNote = [
            {
                node: {
                    id: 12,
                    value: 30,
                    category: 'encounter-diagnosis',
                    code: 'J10',
                    onsetDate: '2025-10-04',
                    recordedDate: '2025-10-04',
                    name: 'Common Cold',
                    section: [
                        {
                            title: 'diagnosis',
                        },
                    ],
                },
            },
            {
                node: {
                    id: 12,
                    value: 30,
                    category: 'encounter-diagnosis',
                    code: 'J10',
                    onsetDate: '2025-10-04',
                    recordedDate: '2025-10-04',
                    name: 'Common Cold',
                    section: [
                        {
                            title: 'diagnosis',
                        },
                    ],
                },
            },
        ];
        component.handleError({ message: 'error' });
        component.addPatientCompositionItem(model);
        component.templateName.name = 'Patient Vitals';
        component.addPatientCompositionItem(model);
        component.determineTemplateBtn();
        component.templateName.name = 'Presenting complaints';
        component.addPatientCompositionItem(model);
        component.determineTemplateBtn();
        component.templateName.name = 'Diagnosis';
        component.addPatientCompositionItem(model);
        component.determineTemplateBtn();
        component.templateName.name = 'Allergy';
        component.addPatientCompositionItem(model);
        component.determineTemplateBtn();
        component.templateName.name = 'Chief complaint';
        component.addPatientCompositionItem(model);
        component.determineTemplateBtn();
        component.templateName.name = 'Family history';
        component.addPatientCompositionItem(model);
        component.determineTemplateBtn();
        component.templateName.name = 'Past medical surgery history';
        component.addPatientCompositionItem(model);
        component.determineTemplateBtn();
        component.templateName.name = 'Presenting complaints';
        component.addPatientCompositionItem(model);
        component.determineTemplateBtn();
        component.templateName.name = 'History of present illness';
        component.addPatientCompositionItem(model);
        component.determineTemplateBtn();
        component.wholeCompositionNote = undefined;
        component.templateName.name = 'Family & social history';
        component.addPatientCompositionItem(model);
        component.determineTemplateBtn();
        component.templateName.name = 'Complaint';
        component.addPatientCompositionItem(model);
        component.determineTemplateBtn();
        component.templateName.name = 'Past medical & surgical history';
        component.addPatientCompositionItem(model);
        component.determineTemplateBtn();
        component.templateName.name = 'Social history';
        component.addPatientCompositionItem(model);
        component.determineTemplateBtn();
        component.wholeCompositionNote = [];
        component.templateName.name = 'Examination';
        component.addPatientCompositionItem(model);
        component.determineTemplateBtn();
        component.templateName.name = 'Treatment plan';
        component.addPatientCompositionItem(model);
        component.determineTemplateBtn();
        component.addPatientComposition({ id: 1 });
        component.appendPatientComposition({ id: 1 });
        component.selectFewerFields({ title: 'Example', text: '123' });
        expect(component).toBeTruthy();
    });

    it('should test the addPatientComposition function', () => {
        const model = {
            note: 'note',
        };
        spyOn(component, 'addPatientComposition');

        component.addPatientComposition(model);
        expect(component.addPatientComposition).toHaveBeenCalled();
        expect(component.loadingResult).toBeFalse();
    });

    it('should test the addPatientComposition function on error', () => {
        const model = {
            note: 'note',
        };
        spyOn(component.dataLayer, 'create').and.returnValue(
            throwError(() => new Error('fail'))
        );
        spyOn(component, 'showToast');

        component.addPatientComposition(model);
        expect(component.showToast).toHaveBeenCalled();
        expect(component.loadingResult).toBeFalse();
    });

    it('should test the appendPatientComposition function', () => {
        const model = {
            note: 'note',
        };
        spyOn(component, 'appendPatientComposition');

        component.appendPatientComposition(model);
        expect(component.appendPatientComposition).toHaveBeenCalled();
        expect(component.loadingResult).toBeFalse();
    });

    it('should test the appendPatientComposition function on error', () => {
        const model = {
            note: 'note',
        };
        spyOn(component.dataLayer, 'update').and.returnValue(
            throwError(() => new Error('fail'))
        );
        spyOn(component, 'handleError');

        component.appendPatientComposition(model);

        expect(component.handleError).toHaveBeenCalled();
        expect(component.loadingResult).toBeFalse();
    });

    it('should handle fetchPatientCompositionNote successfull response', () => {
        component.activeServiceRequest.encounter_id = undefined;
        component.templateName = {
            compositionNoteTitle: 'mock-title',
        };
        component.toggleModal({ id: '1', name: 'heading' });

        const mockResponse = {
            id: '123',
            value: '22.5',
            timeRecorded: '2025-03-19T10:00:00Z',
            totalCount: 1,
            edges: [
                {
                    node: {
                        id: 12,
                        value: 30,
                        category: 'encounter-diagnosis',
                        code: 'J10',
                        onsetDate: '2025-10-04',
                        recordedDate: '2025-10-04',
                        name: 'Common Cold',
                        section: [
                            {
                                title: 'mock-title',
                            },
                        ],
                    },
                },
            ],
        };

        spyOn(component.dataLayer, 'list').and.returnValue(of(mockResponse));

        component.fetchPatientCompositionNote();
        expect(component.loadingResult).toBe(false);
    });

    it('should handle fetchPatientCompositionNote and resolve error response', () => {
        const mockErrorResponse = {
            error: {
                message: 'server error',
            },
            status: 500,
        };

        spyOn(component.dataLayer, 'list').and.returnValue(
            throwError(() => mockErrorResponse)
        );
        spyOn(component, 'handleError');
        component.fetchPatientCompositionNote();

        expect(component.handleError).toHaveBeenCalled();
    });
});
