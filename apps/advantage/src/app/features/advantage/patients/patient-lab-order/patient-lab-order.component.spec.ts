import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientLabOrderComponent } from './patient-lab-order.component';
import {
    NbGlobalPhysicalPosition,
    NbToastrService,
    NbStatusService,
    NbToastrModule,
    NbThemeModule,
} from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { of, throwError } from 'rxjs';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
    }
}

const uiRouterGlobalsStub = {
    params: { serviceRequestId: 'service-request-id' },
};

class SilStoresServiceStub {
    create() {
        return of([
            {
                id: '1',
                name: 'test.pdf',
                mediaLink: 'http://example.com/media.pdf',
            },
        ]);
    }

    get() {
        return of({ encounter: { id: 'encounter-id' } });
    }

    list() {
        return of({
            edges: [{ node: { mediaLink: 'http://example.com/media.pdf' } }],
        });
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getUser() {
        return { client_types: ['PROVIDER'] };
    }
    getOrgSettings() {
        return [{ name: 'patients:patient_full_name', value: true }];
    }
    getErpOrganisation() {
        return { user_workstations: [{ workstation: '1' }] };
    }
}

class StateServiceStub {
    go() {
        return true;
    }
}

class TransitionStub {
    from() {
        return { name: 'previous.state', params: {} };
    }
    params() {
        return { id: 1 };
    }
}

class NbToastrServiceStub {
    show() {
        return {};
    }
}

class NbStatusServiceStub {
    isCustomStatus() {}
}

class ErrorHandlerServiceStub {
    handleError() {}
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

describe('PatientLabOrderComponent', () => {
    let component: PatientLabOrderComponent;
    let fixture: ComponentFixture<PatientLabOrderComponent>;
    let silStoresService: SilStoresService;
    let errorHandler: ErrorHandlerService;
    let toastrService: NbToastrService;
    let stateService: StateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                PatientLabOrderComponent,
                NbToastrModule.forRoot(),
                NbThemeModule.forRoot(),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uiRouterGlobalsStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: ErrorHandlerService,
                    useClass: ErrorHandlerServiceStub,
                },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                {
                    provide: NbGlobalPhysicalPosition,
                    useValue: NbGlobalPhysicalPosition,
                },
            ],
        });

        fixture = TestBed.createComponent(PatientLabOrderComponent);
        component = fixture.componentInstance;
        silStoresService = TestBed.inject(SilStoresService);
        errorHandler = TestBed.inject(ErrorHandlerService);
        toastrService = TestBed.inject(NbToastrService);
        stateService = TestBed.inject(StateService);
        fixture.detectChanges();
    });

    it('should call fetchLabOrderDetails and set encounterId on ngOnInit', () => {
        const fetchSpy = spyOn(component, 'fetchLabOrderDetails').and.callFake(
            () => {
                component.encounterId = 'encounter-id';
            }
        );

        component.ngOnInit();
        expect(fetchSpy).toHaveBeenCalled();
        expect(component.encounterId).toBe('encounter-id');
    });

    it('should set formConfig with checkExpressionOn property on ngOnInit', () => {
        component.ngOnInit();
        expect(component.formConfig).toEqual({
            checkExpressionOn: 'changeDetectionCheck',
        });
    });

    it('should handle error when fetchLabOrderDetails fails on ngOnInit', () => {
        const error = new Error('Test error');

        component.uiglobals.params = {
            serviceRequestId: 'service-request-id',
        } as any;

        spyOn(silStoresService, 'get').and.returnValue(throwError(() => error));

        const errorSpy = spyOn(errorHandler, 'handleError');

        component.fetchLabOrderDetails();

        expect(errorSpy).toHaveBeenCalledWith(error, component, 'clinical');
        expect(component.loading).toBeFalse();
    });

    it('should toggle modal state from false to true', () => {
        component.toggle = { addResult: false };
        component.toggleModal('addResult');
        expect(component.toggle['addResult']).toBeTrue();
    });

    it('should toggle modal state from true to false', () => {
        component.toggle = { addResult: true };
        component.toggleModal('addResult');
        expect(component.toggle['addResult']).toBeFalse();
    });

    it('should initialize context in toggle if it does not exist', () => {
        expect(component.toggle['newContext']).toBeUndefined();
        component.toggleModal('newContext');
        expect(component.toggle['newContext']).toBeTrue();
    });

    it('should test getTestResultsByCode', () => {
        expect(component.getTestResultsByCode('testCode')).toEqual([]);
    });

    it('should update formData with the provided model', () => {
        const testModel = { test: 'value' };
        const result = component.detectModelChange(testModel);
        expect(component.formData).toEqual(testModel);
        expect(result).toEqual(testModel);
    });

    it('should call toastrService.show with correct parameters', () => {
        const toastrSpy = spyOn(toastrService, 'show');
        const position = NbGlobalPhysicalPosition.TOP_RIGHT;

        const status = 'success';
        const msg = 'Test message';
        const context = 'Test context';

        component.showToast(position, status, msg, context);

        expect(toastrSpy).toHaveBeenCalledWith(context, msg, {
            position,
            status,
            duration: 7000,
        });
    });

    it('should call toastrService.show with correct parameters for error toast', () => {
        const toastSpy = spyOn(toastrService, 'show');
        const position = NbGlobalPhysicalPosition.TOP_RIGHT;
        const status = 'danger';
        const context = 'Title';
        const msg = 'Message';

        component.showToastError(position, status, msg, context);

        expect(toastSpy).toHaveBeenCalledWith('Title', 'Message', {
            position,
            status,
            duration: 7000,
        });
    });

    it('should not attempt to fetch lab order details if serviceRequestId is not provided', () => {
        component.uiglobals.params = {} as any;
        const getSpy = spyOn(silStoresService, 'get');
        component.fetchLabOrderDetails();
        expect(getSpy).not.toHaveBeenCalled();
    });

    it('should fetch lab order attachments and open media link', () => {
        spyOn(window, 'open');
        spyOn(silStoresService, 'list').and.returnValue(
            of({
                edges: [
                    { node: { mediaLink: 'http://example.com/media.pdf' } },
                ],
            })
        );

        component.fetchLabOrderAttachments(
            'service-request-id',
            'encounter-id',
            'result-id'
        );

        expect(window.open).toHaveBeenCalledWith(
            'http://example.com/media.pdf',
            '_blank'
        );
        expect(component.loadingAttachments['result-id']).toBeFalse();
    });

    it('should handle error when fetching attachments fails', () => {
        spyOn(silStoresService, 'list').and.returnValue(
            throwError(() => new Error('Test error'))
        );
        const errorSpy = spyOn(errorHandler, 'handleError');
        component.fetchLabOrderAttachments(
            'service-request-id',
            'encounter-id',
            'result-id'
        );
        expect(errorSpy).toHaveBeenCalled();
        expect(component.loadingAttachments['result-id']).toBeFalse();
    });

    it('should not open window if no media link is returned', () => {
        spyOn(window, 'open');
        spyOn(silStoresService, 'list').and.returnValue(of({ edges: [] }));
        component.fetchLabOrderAttachments(
            'service-request-id',
            'encounter-id',
            'result-id'
        );
        expect(window.open).not.toHaveBeenCalled();
    });

    it('should upload file and populate mediaData', async () => {
        const file = new File(['dummy'], 'test.pdf', {
            type: 'application/pdf',
        });
        const createSpy = spyOn(silStoresService, 'create').and.callThrough();
        component.encounterId = 'encounter-id';
        component.formData = { file };
        await component.uploadFile(file);
        expect(createSpy).toHaveBeenCalled();
        expect(component.mediaData.length).toBe(1);
        expect(component.uploadingFile).toBeFalse();
        expect(component.savingResult).toBeTrue();
    });

    it('should handle error when upload fails', async () => {
        const file = new File(['dummy'], 'test.pdf', {
            type: 'application/pdf',
        });
        spyOn(silStoresService, 'create').and.returnValue(
            throwError(() => new Error('Upload failed'))
        );
        const errorSpy = spyOn(errorHandler, 'handleError');
        component.encounterId = 'encounter-id';
        component.formData = { file };

        await expectAsync(component.uploadFile(file)).toBeRejected();
        expect(errorSpy).toHaveBeenCalled();
        expect(component.uploadingFile).toBeFalse();
    });

    it('should record test results and reset state', async () => {
        spyOn(component, 'showToast');
        spyOn(component, 'fetchLabOrderDetails');
        spyOn(component, 'toggleModal');
        const createSpy = spyOn(silStoresService, 'create').and.callThrough();
        component.labOrderDetails = { encounter: { id: 'encounter-id' } };
        component.formData = { remarks: 'remark', selected_result: 'result' };
        component.mediaData = [
            {
                id: '1',
                name: 'test.pdf',
                mediaLink: 'http://example.com/media.pdf',
            },
        ];
        await component.recordTestResults();
        expect(createSpy).toHaveBeenCalled();
        expect(component.showToast).toHaveBeenCalled();
        expect(component.fetchLabOrderDetails).toHaveBeenCalled();
        expect(component.toggleModal).toHaveBeenCalledWith('addResult');
        expect(component.mediaData).toEqual([]);
        expect(component.formData).toEqual({});
    });

    it('should call uploadFile and recordTestResults when attachment is true', async () => {
        const file = new File(['dummy'], 'test.pdf', {
            type: 'application/pdf',
        });
        const uploadSpy = spyOn(component, 'uploadFile').and.returnValue(
            Promise.resolve()
        );
        const recordSpy = spyOn(component, 'recordTestResults').and.returnValue(
            Promise.resolve()
        );
        const formData = { attachment: true, file };
        component.formData = formData;
        await component.submitTest();
        expect(uploadSpy).toHaveBeenCalledWith(file);
        expect(recordSpy).toHaveBeenCalledWith(formData);
    });

    it('should only call recordTestResults when attachment is false', async () => {
        const uploadSpy = spyOn(component, 'uploadFile');
        const recordSpy = spyOn(component, 'recordTestResults').and.returnValue(
            Promise.resolve()
        );
        const formData = { attachment: false };
        component.formData = formData;
        await component.submitTest();
        expect(uploadSpy).not.toHaveBeenCalled();
        expect(recordSpy).toHaveBeenCalledWith(formData);
    });

    it('should use passed model for payload instead of formData', async () => {
        let capturedPayload: any = {};
        spyOn(silStoresService, 'create').and.callFake(
            (_storeName: string, payload: any) => {
                capturedPayload = payload;
                return of({});
            }
        );
        spyOn(component, 'fetchLabOrderDetails');
        spyOn(component, 'toggleModal');
        component.labOrderDetails = { encounter: { id: 'encounter-id' } };
        component.formData = {};
        component.mediaData = [];

        const model = {
            selected_result: 'Negative (BIRADS 1)',
            remarks: 'test remarks',
        };
        await component.recordTestResults(model);

        expect(capturedPayload.entry.findings).toBe('Negative (BIRADS 1)');
        expect(capturedPayload.entry.note).toBe('test remarks');
    });

    it('should preserve findings in payload when formData is reset during file upload', async () => {
        const file = new File(['dummy'], 'test.pdf', {
            type: 'application/pdf',
        });
        component.formData = {
            attachment: true,
            file,
            selected_result: 'Negative (BIRADS 1)',
            remarks: 'test remarks',
        };
        component.labOrderDetails = { encounter: { id: 'encounter-id' } };
        component.encounterId = 'encounter-id';

        let capturedPayload: any;
        spyOn(silStoresService, 'create').and.callFake(
            (storeName: string, payload: any) => {
                if (storeName === 'upload') {
                    component.formData = {};
                    return of([
                        {
                            id: '1',
                            name: 'test.pdf',
                            mediaLink: 'http://example.com',
                        },
                    ]);
                }
                capturedPayload = payload;
                return of({});
            }
        );
        spyOn(component, 'fetchLabOrderDetails');
        spyOn(component, 'toggleModal');

        await component.submitTest();

        expect(capturedPayload.entry.findings).toBe('Negative (BIRADS 1)');
        expect(capturedPayload.entry.note).toBe('test remarks');
    });

    it('should navigate back to the previous state when available', () => {
        component.previousState = {
            name: 'previous.state',
            params: { id: 123 },
        };
        const stateSpy = spyOn(stateService, 'go');
        component.navigateBack();
        expect(stateSpy).toHaveBeenCalledWith('previous.state', { id: 123 });
    });

    it('should handle empty resultId', () => {
        const listSpy = spyOn(silStoresService, 'list').and.returnValue(
            of({ edges: [] })
        );
        component.fetchLabOrderAttachments(
            'service-request-id',
            'encounter-id',
            ''
        );
        expect(listSpy).toHaveBeenCalled();
        expect(component.loadingAttachments['']).toBeFalse();
    });

    it('should fallback to default route if previousState is null', () => {
        component['previousState'] = null;
        const stateSpy = spyOn(stateService, 'go');
        component.navigateBack();
        expect(stateSpy).toHaveBeenCalledWith('app.advantage.lab_orders');
    });

    it('should fallback to default route if previousState has no name', () => {
        component['previousState'] = {};
        const stateSpy = spyOn(stateService, 'go');
        component.navigateBack();
        expect(stateSpy).toHaveBeenCalledWith('app.advantage.lab_orders');
    });

    it('should return "Uploading File" when uploadingFile is true', () => {
        component.uploadingFile = true;
        expect(component.submitButtonLabel).toBe('Uploading File');
    });

    it('should return "Add Result" when uploadingFile is false', () => {
        component.uploadingFile = false;
        expect(component.submitButtonLabel).toBe('Add Result');
    });

    it('should navigate back to the previous state when available', () => {
        component.previousState = {
            name: 'previous.state',
            params: { id: 123 },
        };
        const stateSpy = spyOn(stateService, 'go');
        component.navigateBack();
        expect(stateSpy).toHaveBeenCalledWith('previous.state', { id: 123 });
    });

    it('should fallback to default route if previousState is null', () => {
        component.previousState = null;
        const stateSpy = spyOn(stateService, 'go');
        component.navigateBack();
        expect(stateSpy).toHaveBeenCalledWith('app.advantage.lab_orders');
    });

    it('should fallback to default route if previousState has no name', () => {
        component.previousState = { params: { id: 123 } };
        const stateSpy = spyOn(stateService, 'go');
        component.navigateBack();
        expect(stateSpy).toHaveBeenCalledWith('app.advantage.lab_orders');
    });

    it('should include media in payload when mediaData has items', async () => {
        const mediaData = [
            {
                id: '1',
                name: 'test.pdf',
                mediaLink: 'http://example.com/media.pdf',
            },
        ];

        let capturedPayload: any = {};
        spyOn(silStoresService, 'create').and.callFake(
            (_storeName, payload) => {
                capturedPayload = payload;
                return of({});
            }
        );

        component.labOrderDetails = { encounter: { id: 'encounter-id' } };
        component.formData = {
            remarks: 'test remarks',
            selected_result: 'test result',
        };
        component.mediaData = [...mediaData];

        await component.recordTestResults();

        expect(capturedPayload.entry.media).toBeDefined();
        expect(capturedPayload.entry.media).toEqual(mediaData);
    });

    it('should not include media in payload when mediaData is empty', async () => {
        const createSpy = spyOn(silStoresService, 'create').and.returnValue(
            of({})
        );
        component.labOrderDetails = { encounter: { id: 'encounter-id' } };
        component.formData = {
            remarks: 'test remarks',
            selected_result: 'test result',
        };

        component.mediaData = [];

        await component.recordTestResults();

        expect(createSpy).toHaveBeenCalled();

        const actualPayload = createSpy.calls.mostRecent().args[1];

        expect((actualPayload as any).entry.media).toBeUndefined();
    });
});

describe('PatientLabOrderComponent Error Instance', () => {
    let component: PatientLabOrderComponent;
    let fixture: ComponentFixture<PatientLabOrderComponent>;
    let silStoresService: SilStoresService;
    let errorHandler: ErrorHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                PatientLabOrderComponent,
                NbToastrModule.forRoot(),
                NbThemeModule.forRoot(),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uiRouterGlobalsStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: ErrorHandlerService,
                    useClass: ErrorHandlerServiceStub,
                },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                {
                    provide: NbGlobalPhysicalPosition,
                    useValue: NbGlobalPhysicalPosition,
                },
            ],
        });

        fixture = TestBed.createComponent(PatientLabOrderComponent);
        component = fixture.componentInstance;
        silStoresService = TestBed.inject(SilStoresService);
        errorHandler = TestBed.inject(ErrorHandlerService);
        fixture.detectChanges();
    });

    it('should handle error when recording test results fails', async () => {
        spyOn(silStoresService, 'create').and.returnValue(
            throwError(() => new Error('API call failed'))
        );
        const errorSpy = spyOn(errorHandler, 'handleError');
        component.labOrderDetails = { encounter: { id: 'encounter-id' } };
        component.formData = { remarks: 'remark', selected_result: 'result' };

        await expectAsync(component.recordTestResults()).toBeRejected();
        expect(errorSpy).toHaveBeenCalled();
        expect(component.loading).toBeFalse();
    });

    it('should handle error in submitTest', async () => {
        const error = new Error('Test error');
        spyOn(component, 'uploadFile').and.throwError(error);
        const errorSpy = spyOn(errorHandler, 'handleError');
        component.formData = {
            attachment: true,
            file: new File(['dummy'], 'test.pdf'),
        };
        await component.submitTest();
        expect(errorSpy).toHaveBeenCalledTimes(2);
    });

    it('should test errorHandlerFxn function', () => {
        spyOn(component, 'errorHandlerFxn').and.callThrough();
        component.errorHandlerFxn(new Error('Boom'));
        expect(component.errorHandlerFxn).toHaveBeenCalled();
    });
});
