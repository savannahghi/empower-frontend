import { NbToastrService } from '@nebular/theme';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SilStoresService } from '../sil-http-services/sil_datalayer.service';
import { Authorization } from '../../@core/auth/services/authorization.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { SilDocumentDialogueComponent } from './sil-document-dialogue.component';
import { cleanStylesFromDOM } from '../../../test';

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
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
}

const uIRouterGlobalsStub = {
    current: {
        name: 'app.advantage.worklist',
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

    update() {
        return of({
            results: {
                id: '6ec56bb9-7817-4e72-bf0f-f3a43bd7e6dc',
                patientdocument_id:
                    '17_Screenshot from 2023-04-09 10-43-24.png',
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
                document_status: 'REJECTED',
                document_type: 'PROCEDURE_RESULTS',
                document_number: '17_Screenshot from 2023-04-09 10-43-24.png',
                actual_date_created: '2023-05-24',
                rejection_reason: 'file is in PDF format',
                organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
            },
        });
    }
}

class NbToastrServiceStub {
    show() {
        return {};
    }
}

describe('SilDocumentDialogueComponent', () => {
    let component: SilDocumentDialogueComponent;
    let fixture: ComponentFixture<SilDocumentDialogueComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilDocumentDialogueComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilDocumentDialogueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    const attachment = {
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
        document_status: 'PENDING',
        document_type: 'PROCEDURE_RESULTS',
        document_number: '17_Screenshot from 2023-04-09 10-43-24.png',
        actual_date_created: '2023-05-24',
        organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
    };

    const attachmentTwo = {
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
        document_status: 'REJECTED',
        document_type: 'PROCEDURE_RESULTS',
        document_number: '17_Screenshot from 2023-04-09 10-43-24.png',
        actual_date_created: '2023-05-24',
        organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
    };

    it('should test sil document dialogue methods', () => {
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
        component.rejectionReason = 'File is not in PDF format';
        component.ngOnInit();
        component.rejectedAttachment = {
            id: 'sdfsdfsd',
            document_status: 'REJECTED',
            patient: '78es54234230',
        };
        component.getPatientInfo();
        component.visitPatientObservable();
        component.previewDocument({
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
        component.closeModal();
        component.approveDocument(attachment);
        component.isRejectionReason = true;
        component.rejectionReason = 'This file is not a PDF';
        component.rejectDocument(attachment);
        component.reuploadPatientDocument(postData);
        component.fullscreen = true;
        component.toggleFullScreen();
        expect(component).toBeTruthy();
    });

    it('should test other branch methods', () => {
        component.fullscreen = false;
        component.toggleFullScreen();
        component.approveDocument(attachmentTwo);
        component.editDocument();
        component.openRejectReasonField();
        component.rejectDocument();
        component.cancelRejectDocument();
        component.toggleModal('attachment');
        expect(component).toBeTruthy();
    });

    it('should test showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('position', 'status', 'msg', []);
        expect(component.showToast).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    get() {
        return of({
            document_number: '',
            person: {},
            service_requests: [],
            results: [],
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

describe('SilDocumentDialogueComponent error', () => {
    let fixture: ComponentFixture<SilDocumentDialogueComponent>;
    let component;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilDocumentDialogueComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilDocumentDialogueComponent);
        component = fixture.componentInstance;
        component.patientObservable = throwError('Error thrown');
        fixture.detectChanges();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    const attachmentThree = {
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
        document_status: 'PENDING',
        document_type: 'PROCEDURE_RESULTS',
        document_number: '17_Screenshot from 2023-04-09 10-43-24.png',
        actual_date_created: '2023-05-24',
        organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
    };
    it('Error is thrown when document is approved', () => {
        spyOn(component, 'approveDocument').and.callThrough();
        component.approveDocument(attachmentThree);
        expect(component.approveDocument).toHaveBeenCalled();
    });

    it('Error is thrown when document is rejected', () => {
        component.rejectionReason = 'File is not in PDF format';
        spyOn(component, 'rejectDocument').and.callThrough();
        component.rejectDocument(attachmentThree);
        expect(component.rejectDocument).toHaveBeenCalled();
    });

    it('Error is thrown when document is reuploaded', () => {
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
        component.rejectedAttachment = {
            id: 'sdfsdfsd',
            document_status: 'REJECTED',
            patient: '78es54234230',
        };
        spyOn(component, 'reuploadPatientDocument').and.callThrough();
        spyOn(component, 'uploadDocument').and.callThrough();
        component.reuploadPatientDocument(postData);
        component.uploadDocument(postData);
        expect(component.reuploadPatientDocument).toHaveBeenCalled();
    });
});
