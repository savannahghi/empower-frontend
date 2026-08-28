import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals, Transition } from '@uirouter/core';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { PatientAttachmentsComponent } from './patient-attachments.component';
import { SilDocumentDialogueComponent } from '../../../../shared/sil-document-dialogue/sil-document-dialogue.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { cleanStylesFromDOM } from '../../../../../test';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
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

class AuthenticationStub {
    checkPermission() {
        return true;
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
    getOrgSettings() {
        return [
            {
                name: 'patients:patient_full_name',
                value: true,
            },
        ];
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    transition() {
        return true;
    }
}

class TransitionStub {
    params() {
        return { id: 'some-id' };
    }
    from() {
        return {};
    }
}

const uIRouterGlobalsStub = {
    params: {
        id: '112',
        service_request: 'wer',
        page_size: '2',
        queue: 1,
    },
    $current: {
        params: {
            page_size: '2',
        },
    },
};

const stateServiceStub = {
    reset() {
        return true;
    },
    go() {
        return true;
    },
    includes() {
        return true;
    },
    transitionTo() {
        return true;
    },
    param() {
        return true;
    },
};

class SilStoresServiceStub {
    get() {
        return of({
            results: [],
        });
    }

    downloadDocument() {
        return of({ response: {} });
    }

    create() {
        return of({
            id: '4ed62h7281262h1',
            service_requests: [{ id: '2' }],
        });
    }

    list() {
        return of({
            results: {
                new_price: 18,
                amount: '18',
                product_name: 'Lipid',
                quantity: 1,
            },
        });
    }
}
class NbToastrServiceStub {
    show() {
        return {};
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

describe('PatientAttachmentsComponent', () => {
    let component: PatientAttachmentsComponent;
    let fixture: ComponentFixture<PatientAttachmentsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                mockPipe('age'),
                mockPipe('titleCase'),
                mockPipe('objectToArray'),
                mockPipe('translate'),
            ],
            declarations: [
                PatientAttachmentsComponent,
                SilDocumentDialogueComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: StateService, useValue: stateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PatientAttachmentsComponent);
        TestBed.createComponent(SilDocumentDialogueComponent);
        component = fixture.componentInstance;
        component.patientObservable = of({ id: 1, person: { gender: 'MALE' } });
        fixture.detectChanges();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should test refreshDocuments fn ', async () => {
        spyOn(component, 'refreshDocuments').and.callThrough();
        component.refreshDocuments({
            id: '6ec56bb9-7817-4e72-bf0f-f3a43bd7e6dc',
            patientdocument_id: '17_Screenshot from 2023-04-09 10-43-24.png',
            patient: 'Patient ID: 17',
            workstation_id: '4c93fde6-2998-4044-8c64-cffddb738018',
            department_id: '4f2ede94-cb03-4532-9c38-a455470cfe0e',
            branch_id: 'c685d3f7-08f6-40ec-b343-c31323a6fcd2',
            active: false,
            created: '2023-05-24T15:47:03.393839+03:00',
            created_by: 'bed451b3-4dca-4bd4-87be-c23d481c7386',
            updated: '2023-05-24T15:47:03.393866+03:00',
            updated_by: 'bed451b3-4dca-4bd4-87be-c23d481c7386',
            content_type: 'image/png',
            title: 'Screenshot from 2023-04-09 10-43-24.png',
            creation_date: '2023-05-24T15:47:03.362100+03:00',
            size: 124424,
            description: 'this is the procedure results',
            aspect_ratio: '775:821',
            document_type: 'PROCEDURE_RESULTS',
            document_number: '17_Screenshot from 2023-04-09 10-43-24.png',
            actual_date_created: '2023-05-24',
            organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
        });
        expect(component.refreshDocuments).toHaveBeenCalled();
    });

    it('should test functions and showToast method', () => {
        const postData = {
            patient: 'bc471533-fd5e-4dbf-b929-84db939d9630',
            fileEvent: {
                name: 'RATE CARD - ROLLING CARGO DUBAI UPDATED (2).pdf',
                lastModified: 1683364292659,
                size: 103965,
                type: 'application/pdf',
                webkitRelativePath: '',
            },
            title: 'cancer screening',
            document_type: 'RADIOLOGY_RESULTS',
            description: 'This is the cancer screening results',
            actual_date_created: '2023-05-19T09:42:12.056Z',
        };
        component.attachments = [
            {
                id: 'a4f0df3e-a8e1-48c6-949f-ba72455408e9',
                patientdocument_id:
                    "17_Dr. Nini's Clinic - Slade360 Advantage Contract.pdf",
                patient: 'Patient ID: 17',
                workstation_id: '1cc1e9bf-abf5-49b3-80b2-ae81e26270dd',
                department_id: '4f2ede94-cb03-4532-9c38-a455470cfe0e',
                branch_id: 'c685d3f7-08f6-40ec-b343-c31323a6fcd2',
                active: false,
                created: '2023-05-23T10:03:39.639562+03:00',
                created_by: '6cd404ce-4cb4-4161-9c5e-113d6a8f7c78',
                updated: '2023-05-23T10:03:39.639595+03:00',
                updated_by: '6cd404ce-4cb4-4161-9c5e-113d6a8f7c78',
                content_type: 'application/pdf',
                title: "Dr. Nini's Clinic - Slade360 Advantage Contract.pdf",
                creation_date: '2023-05-23T10:03:39.601093+03:00',
                size: 218852,
                description: 'undefined',
                aspect_ratio: null,
                document_type: 'CLINICAL_NOTES',
                document_number:
                    "17_Dr. Nini's Clinic - Slade360 Advantage Contract.pdf",
                actual_date_created: '2023-05-23',
                organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
            },
            {
                id: '000e25f9-5ee7-44b1-a609-6554965f0cad',
                patientdocument_id:
                    '17_invoice-93bdfe72-3a84-415e-8e6e-da7cbd36f901 (1).pdf',
                patient: 'Patient ID: 17',
                workstation_id: 'a205494d-28f2-413a-875c-5b4008153b2e',
                department_id: '4f2ede94-cb03-4532-9c38-a455470cfe0e',
                branch_id: 'c685d3f7-08f6-40ec-b343-c31323a6fcd2',
                active: false,
                created: '2023-05-22T14:25:09.152547+03:00',
                created_by: '6cd404ce-4cb4-4161-9c5e-113d6a8f7c78',
                updated: '2023-05-22T14:25:09.152572+03:00',
                updated_by: '6cd404ce-4cb4-4161-9c5e-113d6a8f7c78',
                content_type: 'application/pdf',
                title: 'invoice-93bdfe72-3a84-415e-8e6e-da7cbd36f901 (1).pdf',
                creation_date: '2023-05-22T14:25:09.137735+03:00',
                size: 218852,
                description: 'undefined',
                aspect_ratio: null,
                document_type: 'CLINICAL_NOTES',
                document_number:
                    '17_invoice-93bdfe72-3a84-415e-8e6e-da7cbd36f901 (1).pdf',
                actual_date_created: '2023-05-22',
                organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
            },
        ];
        spyOn(component, 'showToast').and.callThrough();
        component.getPatientInfo();
        component.toggleModal('attachment');
        component.addPatientAttachment(postData);
        component.showToast('position', 'status', 'msg', []);
        component.previewDoc({
            id: '6ec56bb9-7817-4e72-bf0f-f3a43bd7e6dc',
            patientdocument_id: '17_Screenshot from 2023-04-09 10-43-24.png',
            patient: 'Patient ID: 17',
            workstation_id: '4c93fde6-2998-4044-8c64-cffddb738018',
            department_id: '4f2ede94-cb03-4532-9c38-a455470cfe0e',
            branch_id: 'c685d3f7-08f6-40ec-b343-c31323a6fcd2',
            active: false,
            created: '2023-05-24T15:47:03.393839+03:00',
            created_by: 'bed451b3-4dca-4bd4-87be-c23d481c7386',
            updated: '2023-05-24T15:47:03.393866+03:00',
            updated_by: 'bed451b3-4dca-4bd4-87be-c23d481c7386',
            content_type: 'application/pdf',
            title: 'Screenshot from 2023-04-09 10-43-24.png',
            creation_date: '2023-05-24T15:47:03.362100+03:00',
            size: 124424,
            description: 'this is the procedure results',
            aspect_ratio: '775:821',
            document_type: 'PROCEDURE_RESULTS',
            document_number: '17_Screenshot from 2023-04-09 10-43-24.png',
            actual_date_created: '2023-05-24',
            organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
        });
        component.previewDoc({
            id: '6ec56bb9-7817-4e72-bf0f-f3a43bd7e6dc',
            patientdocument_id: '17_Screenshot from 2023-04-09 10-43-24.png',
            patient: 'Patient ID: 17',
            workstation_id: '4c93fde6-2998-4044-8c64-cffddb738018',
            department_id: '4f2ede94-cb03-4532-9c38-a455470cfe0e',
            branch_id: 'c685d3f7-08f6-40ec-b343-c31323a6fcd2',
            active: false,
            created: '2023-05-24T15:47:03.393839+03:00',
            created_by: 'bed451b3-4dca-4bd4-87be-c23d481c7386',
            updated: '2023-05-24T15:47:03.393866+03:00',
            updated_by: 'bed451b3-4dca-4bd4-87be-c23d481c7386',
            content_type: 'image/png',
            title: 'Screenshot from 2023-04-09 10-43-24.png',
            creation_date: '2023-05-24T15:47:03.362100+03:00',
            size: 124424,
            description: 'this is the procedure results',
            aspect_ratio: '775:821',
            document_type: 'PROCEDURE_RESULTS',
            document_number: '17_Screenshot from 2023-04-09 10-43-24.png',
            actual_date_created: '2023-05-24',
            organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
        });
        expect(component.showToast).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    get() {
        return of({
            document_number: '1231',
            person: {
                age: { years: 55, months: 0, weeks: 0, days: 0 },
                phone_number: '0723856342',
            },
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 100,
                    },
                },
            ],
            results: [
                {
                    document_number: '1231',
                    made_by: 'John',
                    invoice_date: '2022-11-12T12:53:07.850000+03:00',
                    amount: 20,
                },
            ],
        });
    }

    downloadDocument() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    createNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('PatientAttachmentsComponent other branch calls', () => {
    let component: PatientAttachmentsComponent;
    let fixture: ComponentFixture<PatientAttachmentsComponent>;
    let button;

    beforeEach(async () => {
        button = `<button
        type="button"
        id="close-modal"
        data-bs-dismiss="modal"
        aria-label="Close"
        class="btn-close"></button>`;
        document.body.append(button);
        await TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                mockPipe('age'),
                mockPipe('titleCase'),
                mockPipe('objectToArray'),
                mockPipe('translate'),
            ],
            declarations: [PatientAttachmentsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: StateService, useValue: stateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PatientAttachmentsComponent);
        component = fixture.componentInstance;
        component.patientObservable = of({ id: 1, person: { gender: 'MALE' } });
        fixture.detectChanges();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should test component functions', () => {
        component.valueEmittedFromChildComponent = 'refresh';
        spyOn(component, 'getAttachments').and.callThrough();
        component.fullscreen = true;
        component.toggleModal('attachment');
        component.getAttachments();
        expect(component.getAttachments).toHaveBeenCalled();
    });

    it('should test functions and showToast method', () => {
        const postData = {
            patient: 'bc471533-fd5e-4dbf-b929-84db939d9630',
            fileEvent: {
                name: 'RATE CARD - ROLLING CARGO DUBAI UPDATED (2).pdf',
                lastModified: 1683364292659,
                size: 103965,
                type: 'application/pdf',
                webkitRelativePath: '',
            },
            title: 'cancer screening',
            document_type: 'RADIOLOGY_RESULTS',
            description: 'This is the cancer screening results',
            actual_date_created: '2023-05-19T09:42:12.056Z',
        };
        spyOn(component, 'showToast').and.callThrough();
        component.toggleModal('attachment');
        component.fullscreen = true;
        document.getElementById('document_modal');
        component.addPatientAttachment(postData);
        component.showToast('position', 'status', 'msg', []);
        expect(component.showToast).toHaveBeenCalled();
    });
});

describe('PatientAttachmentsComponent error', () => {
    let fixture: ComponentFixture<PatientAttachmentsComponent>;
    let component;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                mockPipe('age'),
                mockPipe('titleCase'),
                mockPipe('objectToArray'),
                mockPipe('translate'),
            ],
            declarations: [PatientAttachmentsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: UIRouterGlobals },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        });
        fixture = TestBed.createComponent(PatientAttachmentsComponent);
        component = fixture.componentInstance;
        component.patientObservable = throwError('Error thrown');
        fixture.detectChanges();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('Error is thrown when patient is not resolved', () => {
        spyOn(component, 'getPatientInfo').and.callThrough();
        component.valueEmittedFromChildComponent = 'refresh';
        component.getPatientInfo();
        expect(component.getPatientInfo).toHaveBeenCalled();
    });
});
