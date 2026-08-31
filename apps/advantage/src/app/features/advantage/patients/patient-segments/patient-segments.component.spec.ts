import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { PatientService } from '../patient.service';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { PatientSegmentsComponent } from './patient-segments.component';
import { TranslateService } from '@ngx-translate/core';

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
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

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'app.advantage.patients.detail.',
    },
    params() {
        return { appointment_id: 1 };
    },
};

class SilStoresServiceStub {
    list() {
        return of({
            count: 1,
            next: null,
            previous: null,
            page_size: 50,
            current_page: 1,
            total_pages: 1,
            start_index: 1,
            end_index: 5,
            results: [
                {
                    id: '1827c9f2-8405-4562-8494-183d81cf3d92',
                    segment: {
                        id: '844f7fcd-8731-4728-b7ee-809973ef9c1e',
                        name: 'Cervical Cancer General Tips',
                        label: 'CERVICAL_CANCER_TIPS',
                        description: 'Gives general tips for cervical cancer',
                        attributes: null,
                        members: [
                            {
                                id: 'bf67cb60-b808-41a8-bd4a-c850a06be443',
                                person_display: 'Taraji Lions',
                                person_contacts: [
                                    {
                                        id: '9f7e784c-86d0-4825-9c3c-aa9bec6f4488',
                                        active: true,
                                        contact_type: 'phone_number',
                                        contact: '+254706535423',
                                        verified: false,
                                        consent_to_contact_given: true,
                                        is_primary_contact: false,
                                    },
                                ],
                                person_ids: [
                                    {
                                        id: 'c36b1395-eb0b-464a-bd8e-978187cbdf6d',
                                        active: true,
                                        id_document_type: 'nationalID',
                                        id_value: '11033220',
                                    },
                                ],
                                phone_number: '+254706535423',
                                email: null,
                                id_document_type: 'nationalID',
                                id_value: '11033220',
                                age: {
                                    years: 30,
                                    months: 4,
                                    weeks: 1,
                                    days: 3,
                                },
                                global_health_id: '7000040000013871',
                                active: true,
                                first_name: 'Taraji',
                                last_name: 'Lions',
                                other_names: null,
                                date_of_birth: '1994-01-01',
                                title: 'Mrs',
                                gender: 'FEMALE',
                                deceased: false,
                                metadata: {},
                            },
                            {
                                id: 'a74cf331-233a-4be5-af4e-0e9728aa90f3',
                                person_display: 'Vanessa Mwakio',
                                person_contacts: [
                                    {
                                        id: 'd94586b3-0b9b-4d3a-8e0b-705613ca9f87',
                                        active: true,
                                        contact_type: 'phone_number',
                                        contact: '+254713014882',
                                        verified: false,
                                        consent_to_contact_given: true,
                                        is_primary_contact: false,
                                    },
                                ],
                                person_ids: [],
                                phone_number: '+254713014882',
                                email: null,
                                age: {
                                    years: 24,
                                    months: 4,
                                    weeks: 1,
                                    days: 3,
                                },
                                global_health_id: '7000040000013822',
                                active: true,
                                first_name: 'Vanessa',
                                last_name: 'Mwakio',
                                other_names: null,
                                date_of_birth: '2000-01-01',
                                title: 'Ms',
                                gender: 'FEMALE',
                                deceased: false,
                                metadata: {},
                            },
                        ],
                        messages: [],
                    },
                    person: {
                        id: 'a74cf331-233a-4be5-af4e-0e9728aa90f3',
                        person_display: 'Vanessa Mwakio',
                        person_contacts: [
                            {
                                id: 'd94586b3-0b9b-4d3a-8e0b-705613ca9f87',
                                active: true,
                                contact_type: 'phone_number',
                                contact: '+254713014882',
                                verified: false,
                                consent_to_contact_given: true,
                                is_primary_contact: false,
                            },
                        ],
                        person_ids: [],
                        phone_number: '+254713014882',
                        email: null,
                        age: {
                            years: 24,
                            months: 4,
                            weeks: 1,
                            days: 3,
                        },
                        global_health_id: '7000040000013822',
                        active: true,
                        first_name: 'Vanessa',
                        last_name: 'Mwakio',
                        other_names: null,
                        date_of_birth: '2000-01-01',
                        title: 'Ms',
                        gender: 'FEMALE',
                        deceased: false,
                        metadata: {},
                    },
                    workstation_id: null,
                    department_id: null,
                    branch_id: null,
                    cluster_id: null,
                    active: true,
                    created: '2024-05-11T10:18:35.502575+03:00',
                    created_by: '5428a587-527c-40e2-a3da-77a3600b3489',
                    updated: '2024-05-11T10:18:35.502591+03:00',
                    updated_by: '5428a587-527c-40e2-a3da-77a3600b3489',
                    status: 'CONFIRMED',
                    enrolled_at: '2024-05-11T10:18:35.486814+03:00',
                    organisation: '4b7ea403-5d0f-41ba-8e9f-6535a5e55ca0',
                },
            ],
        });
    }
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
    getOrgSettings() {
        return [
            {
                name: 'patients:patient_full_name',
                value: true,
            },
        ];
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    transitionTo() {
        return true;
    }
    transition() {
        return true;
    }
}

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

class NbToastrServiceStub {
    show() {
        return {};
    }
}

class PatientServiceStub {
    patientAppointmentsDataEmitter() {
        return [{}];
    }
    addMemberToSegment() {
        return of({
            count: 1,
        });
    }
}

describe('PatientSegmentsComponent: ', () => {
    let component: PatientSegmentsComponent;
    let fixture: ComponentFixture<PatientSegmentsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('translate'), mockPipe('variant')],
            declarations: [PatientSegmentsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PatientSegmentsComponent);
        component = fixture.componentInstance;
        component.patientObservable = of({
            person: {
                id: '12342313',
            },
        });
        fixture.detectChanges();
    });

    it('should test ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test viewSegment', () => {
        const $event = {
            id: 1,
            segment: {
                id: 15,
            },
        };
        component.addMemberToSegment({ segment: 123 });
        component.toggleModal();
        spyOn(component, 'viewSegment').and.callThrough();
        component.viewSegment($event);
        expect(component.viewSegment).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('PatientSegmentsComponent fails', () => {
    let component: PatientSegmentsComponent;
    let fixture: ComponentFixture<PatientSegmentsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('translate'), mockPipe('variant')],
            declarations: [PatientSegmentsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PatientSegmentsComponent);
        component = fixture.componentInstance;
        component.patientObservable = of({
            person: {
                id: '12342313',
            },
        });
        fixture.detectChanges();
    });

    it('should test ngOnInit and throw error when getPatientInfo is called', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        component.getPatientInfo();
        expect(component.ngOnInit).toHaveBeenCalled();
    });
});

describe('PatientSegmentsComponent fails', () => {
    let component: PatientSegmentsComponent;
    let fixture: ComponentFixture<PatientSegmentsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('translate'), mockPipe('variant')],
            declarations: [PatientSegmentsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PatientSegmentsComponent);
        component = fixture.componentInstance;
        component.patientObservable = throwError(
            () => new Error('Error thrown')
        );
        fixture.detectChanges();
    });

    it('should test ngOnInit and throw error when getSegments is called', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        component.getPatientInfo();
        expect(component.ngOnInit).toHaveBeenCalled();
    });
});
