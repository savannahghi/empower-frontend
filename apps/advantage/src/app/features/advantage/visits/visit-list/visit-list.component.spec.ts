import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { PatientService } from '../../patients/patient.service';
import { LocalStateService } from '../../../../@core/utils/state.service';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { VisitListComponent } from './visit-list.component';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import moment from 'moment';
import { ShepherdService } from 'angular-shepherd';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

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

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
    getAdvantageOrganisation() {
        return {
            organisation_id: 'asdfasdf',
        };
    }
    getOrgSettings() {
        return [
            {
                name: 'patients:patient_full_name',
                value: 'true',
            },
        ];
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'fsdfs09344mlw03434',
            clinical_org_id: 'asdkasdisefd832ksd',
        };
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

class CookieServiceStub {
    getLanguageCookie() {
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

class LocalStateServiceStub {
    getFinalFilters() {
        return { start: '2023-10-29' };
    }
}

class PatientServiceStub {
    patientVisitDataEmitter() {
        return of({
            id: '143224',
        });
    }
    checkPatientExists() {
        return { id: 123 };
    }
    startVisit() {
        return { id: 123 };
    }
    createPatient() {
        return null;
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    reload() {
        return true;
    }
    transitionTo() {
        return true;
    }
}
class TransitionStub {
    params() {
        return { appointment_id: 1 };
    }
}

const uIRouterGlobalsStub = {
    params: {},
    current: {
        name: 'state',
    },
    $current: {
        is: () => true,
    },
};

class SilStoresServiceStub {
    create() {
        return of({
            id: '4ed62h7281262h1',
            service_requests: [{ id: '123' }, { id: '124' }],
        });
    }
    list() {
        return of({
            results: [
                {
                    id: '143223',
                    appointment_status: 'BOOKED',
                    actor: 'FACILITY',
                    specialty: 'OTHER',
                },
            ],
        });
    }
    listNested() {
        return of({
            results: [
                {
                    id: '143223',
                    appointment_status: 'BOOKED',
                    actor: 'FACILITY',
                    specialty: 'OTHER',
                },
            ],
        });
    }
}

class NbToastrServiceStub {
    show() {
        return {};
    }
}

class SilDatatableStubComponent {
    getData: () => {};
}

class ShepherdServiceStub {
    addSteps() {}
    start() {}
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

describe('VisitListComponent', () => {
    let component: VisitListComponent;
    let fixture: ComponentFixture<VisitListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VisitListComponent],
            imports: [mockPipe('translate')],
            providers: [
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: ShepherdService, useClass: ShepherdServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: LocalStateService, useClass: LocalStateServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: SilDatatableComponent,
                    useClass: SilDatatableStubComponent,
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VisitListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test setFilter', () => {
        component.ngOnInit();
        const event = {
            patient_details: { id: '123', name: 'John', age: '20' },
        };
        component.setFilter(event);
        expect(component).toBeTruthy();
    });

    it('should test toggleModal', () => {
        spyOn(component, 'toggleModal').and.callThrough();
        component.toggleModal('addPatient');
        expect(component.toggleModal).toHaveBeenCalled();
    });

    it('should test toggleDrawer', () => {
        spyOn(component, 'toggleDrawer').and.callThrough();
        component.toggleDrawer();
        expect(component.toggleDrawer).toHaveBeenCalled();
    });

    it('should test addPatient', () => {
        spyOn(component, 'addPatient').and.callThrough();
        const model = {
            person: {
                person_contacts: [
                    { contact_type: 'phone_number', contact: '+254707705021' },
                ],
                first_name: 'Alex',
                last_name: 'Checkmate',
                gender: 'MALE',
            },
        };
        component.addPatient(model);
        expect(component.addPatient).toHaveBeenCalledWith(model);
    });

    it('should test confirmPatientExists', () => {
        spyOn(component, 'confirmPatientExists').and.callThrough();
        component.patient = {
            person: {
                date_of_birth: moment(),
                person_contacts: [],
                person_ids: [],
                phone_number: '+254700360360',
                email: 'test@mail.com',
                id_value: '1234567',
                id_document_type: 'NATIONAL_ID',
                person_photos: [],
            },
            id: '123',
        };
        component.confirmPatientExists();
        expect(component.confirmPatientExists).toHaveBeenCalled();
    });

    it('should test startOTCVisit', () => {
        spyOn(component, 'startOTCVisit').and.callThrough();
        const formData = {
            patient: { id: 123, display_name: 'Alex Checkmate' },
            queue: { id: 123 },
        };
        component.startOTCVisit(formData);
        expect(component.startOTCVisit).toHaveBeenCalledWith(formData);
    });

    it('should test startWalkthrough', () => {
        spyOn(component, 'startWalkthrough').and.callThrough();
        component.startWalkthrough();
        expect(component.startWalkthrough).toHaveBeenCalled();
    });

    it('should test submitPatient with +254', () => {
        const model = {
            person: {
                date_of_birth: moment(),
                person_contacts: [],
                person_ids: [],
                phone_number: '+254700360360',
                email: 'test@mail.com',
                id_value: '1234567',
                id_document_type: 'NATIONAL_ID',
                person_photos: [],
            },
            patient_details: { id: '123', name: 'John', age: '20' },
        };
        spyOn(component, 'submitPatient').and.callThrough();
        component.submitPatient(model);
        expect(component.submitPatient).toHaveBeenCalled();
    });

    it('should test submitPatient with 0', () => {
        const model = {
            person: {
                date_of_birth: moment(),
                person_contacts: [],
                person_ids: [],
                phone_number: '0700360360',
                email: 'test@mail.com',
                id_value: '1234567',
                id_document_type: 'NATIONAL_ID',
                person_photos: [],
            },
            patient_details: { id: '123', name: 'John', age: '20' },
        };
        spyOn(component, 'submitPatient').and.callThrough();
        component.submitPatient(model);
        expect(component.submitPatient).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    listNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('VisitListComponent and fail', () => {
    let component: VisitListComponent;
    let fixture: ComponentFixture<VisitListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [mockPipe('translate')],
            declarations: [VisitListComponent],
            providers: [
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: LocalStateService, useClass: LocalStateServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: SilDatatableComponent,
                    useClass: SilDatatableStubComponent,
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VisitListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test submitPatient with 0', () => {
        const model = {
            person: {
                date_of_birth: moment(),
                person_contacts: [],
                person_ids: [],
                phone_number: '0700360360',
                email: 'test@mail.com',
                id_value: '1234567',
                id_document_type: 'NATIONAL_ID',
                person_photos: [],
            },
            patient_details: { id: '123', name: 'John', age: '20' },
        };
        spyOn(component, 'submitPatient').and.callThrough();
        component.submitPatient(model);
        expect(component.submitPatient).toHaveBeenCalled();
    });
});
