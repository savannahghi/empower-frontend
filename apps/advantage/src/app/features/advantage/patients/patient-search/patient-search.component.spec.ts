import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { TranslateService } from '@ngx-translate/core';
import { PatientSearchComponent } from './patient-search.component';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { PatientService } from '../patient.service';

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

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    date_of_birth: '2015-03-03',
                    gender: 'MALE',
                    first_name: 'Patrick',
                    last_name: 'Musembi',
                    person_contacts: [
                        {
                            contact_type: 'phone_number',
                            contact: '712345678',
                            is_primary_contact: true,
                        },
                        {
                            contact_type: 'phone_number',
                            contact: '+254712345678',
                            is_primary_contact: true,
                        },
                    ],
                    person_photos: [],
                    person_ids: [],
                },
            ],
        });
    }
}

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
    }
}

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class AuthorizationConfigStub {
    setAuthDetails() {
        return of(() => {});
    }
    isLoggedIn() {
        return true;
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getOrganisation() {
        return {};
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
    setOrganisationDetails() {
        return of(() => {});
    }
    getErpOrganisation() {
        return {
            client_types: ['PROVIDER'],
            user_workstations: null,
        };
    }
    setAdvantageOrganisationDetails() {
        return {
            client_types: ['PROVIDER'],
            user_workstations: null,
        };
    }
    removeTokenData() {
        return {};
    }
    getWorkstation() {
        return {
            workstation: '1',
            workstation__org_unit: 'dept_1',
            workstation__org_unit__parent: 'branch_1',
            workstation__org_unit__parent__parent: 'cluster_1',
        };
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

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
}

class PatientServiceStub {
    preparePatientPayload() {
        return {
            id: '143224',
        };
    }
    checkPatientExists(patient, comp) {
        return {
            patient: patient,
            comp: comp,
        };
    }
    createPatient() {
        return null;
    }
}

describe('PatientSearchComponent', () => {
    let component: PatientSearchComponent;
    let fixture: ComponentFixture<PatientSearchComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PatientSearchComponent],
            imports: [mockPipe('translate'), mockPipe('variant')],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: PatientService, useClass: PatientServiceStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(PatientSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test view patient', () => {
        component.existingPatient = {
            id: '123',
        };
        spyOn(component, 'viewPatient').and.callThrough();
        component.toggleModal('viewExistingPatient');
        component.viewPatient();
        expect(component.viewPatient).toHaveBeenCalled();
        expect(component.toggle['viewExistingPatient']).toBe(true);
        expect(component).toBeTruthy();
    });

    it('should test checkPatientExistsOnHCRM method with no matches', () => {
        spyOn(component, 'checkPatientExistsOnHCRM').and.callThrough();
        const event = {
            type: 'Event',
            code: 'Enter',
            target: { value: 'Alex' },
        };
        component.searchOnEnter(event);
        component.checkPatientExistsOnHCRM();
        expect(component.checkPatientExistsOnHCRM).toHaveBeenCalled();
    });

    it('should test checkPatientExistsOnHCRM method with matches', () => {
        spyOn(component, 'checkPatientExistsOnHCRM').and.callThrough();
        const event = {
            type: 'Event',
            code: 'Enter',
            target: { value: 'Alex' },
        };
        component.searchOnEnter(event);
        component.createPatientWithHCRMData();
        component.checkPatientExistsOnHCRM();
        expect(component.checkPatientExistsOnHCRM).toHaveBeenCalled();
    });

    it('should test getPatientDetails method', () => {
        spyOn(component, 'getPatientDetails').and.callThrough();
        const event = {
            name: '',
            gender: '',
            phone_number: '',
            email: '',
        };
        component.getPatientDetails(event);
        expect(component.getPatientDetails).toHaveBeenCalled();
    });

    it('should test checkPatientExistsOnHCRM method with errors', () => {
        spyOn(component, 'checkPatientExistsOnHCRM').and.callThrough();
        const event = {
            type: 'Event',
            code: 'Enter',
            target: { value: 'Alex' },
        };
        component.searchOnEnter(event);
        component.checkPatientExistsOnHCRM();
        expect(component.checkPatientExistsOnHCRM).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('PatientSearchComponent: Error', () => {
    let component: PatientSearchComponent;
    let fixture: ComponentFixture<PatientSearchComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PatientSearchComponent],
            imports: [mockPipe('translate'), mockPipe('variant')],
            providers: [
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: PatientService, useClass: PatientServiceStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(PatientSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test checkPatientExistsOnHCRM', () => {
        component.existingPatient = {
            id: '123',
        };
        spyOn(component, 'checkPatientExistsOnHCRM').and.callThrough();
        component.checkPatientExistsOnHCRM();
        expect(component.checkPatientExistsOnHCRM).toHaveBeenCalled();
    });
});
