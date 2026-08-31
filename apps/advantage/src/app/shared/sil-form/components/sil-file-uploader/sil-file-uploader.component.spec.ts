import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SilFileUploaderComponent } from './sil-file-uploader.component';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import {
    NbToastrService,
    NbStepperComponent,
    NbStepComponent,
} from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { BehaviorSubject, of } from 'rxjs';
import { NbStatusService } from '@nebular/theme';
import { FileExtensionPipe } from '../../../../@theme/pipes/file-extension/file-extension.pipe';
import { StepperService } from '../../../../shared/component-services/stepper.service';

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
    }
}

class NbStatusServiceStub {
    isCustomStatus() {}
    getIcon() {}
    getPack() {}
    registerSvgPack() {}
    setDefaultPack() {}
    connectedTo() {}
    build() {}
    getDirection() {}
    subscribeOnTriggers() {}
    trigger() {}
    host() {}
    container() {}
}

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
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
}

class NbToastrServiceStub {
    show() {
        return {};
    }
}

class silStoresServiceStub {
    list() {
        return of(['first_name', 'last_name', 'age', 'date_of_birth']);
    }
    create() {
        return of([{ patient: '123' }]);
    }
    createNested() {
        return of([{ patient: '123' }]);
    }
}

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
    getOrgSettings() {
        return of([
            {
                name: 'patients:patient_full_name',
                value: 'true',
            },
        ]);
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params() {
        return { segment_id: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { segment_id: 1 };
        },
    },
};

class StepperServiceStub {
    previousStep(stepper, param: any) {
        return { step: stepper, param: param };
    }
    handleStepChange() {
        return true;
    }
}

class MockHTMLAnchorElement {
    constructor() {}

    click() {
        return true;
    }

    remove() {
        return true;
    }

    appendChild() {
        return null;
    }
}

class MockBody {
    appendChild() {
        return null;
    }
}

class MockDocumentClass {
    body: MockBody;
    constructor() {
        this.body = new MockBody();
    }

    createElement() {
        const mockAnchorElement = new MockHTMLAnchorElement();
        return mockAnchorElement;
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

describe('SilFileUploaderComponent', () => {
    let component: SilFileUploaderComponent;
    let fixture: ComponentFixture<SilFileUploaderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilFileUploaderComponent, NbStepperComponent],
            imports: [mockPipe('fileExtension')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: silStoresServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StepperService, useClass: StepperServiceStub },
                FileExtensionPipe,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SilFileUploaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.handleStepChange({
            index: 2,
            step: new NbStepComponent(NbStepperComponent),
            previouslySelectedIndex: 1,
            previouslySelectedStep: new NbStepComponent(NbStepperComponent),
        });
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test unsupported file format', () => {
        const mockFileUploadEvent = {
            target: {
                files: [{ type: 'image/png' }],
            },
        };
        spyOn(component, 'handleFile').and.callThrough();
        component.acceptedFileTypes =
            'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        component.handleFile(mockFileUploadEvent);
        expect(component.handleFile).toHaveBeenCalledWith(mockFileUploadEvent);
    });

    it('should test uploaded file has column headers matching those in template', () => {
        const uploadedFileHeaders = ['product_name', 'quantity'];
        const templateHeaders = ['product_name', 'quantity'];
        spyOn(component, 'validateColumnHeaders').and.callThrough();
        component.validateColumnHeaders(templateHeaders, uploadedFileHeaders);
        expect(component.validateColumnHeaders).toHaveBeenCalled();
        expect(component.validateColumnHeaders).toHaveBeenCalledWith(
            templateHeaders,
            uploadedFileHeaders
        );
        expect(component.missingHeaders.length).toBe(0);
    });

    it('should test uploaded file component has one header matching those in template', () => {
        const uploadedFileHeaders = ['product name', 'quantity'];
        const templateHeaders = ['product_name', 'quantity'];
        spyOn(component, 'validateColumnHeaders').and.callThrough();
        component.validateColumnHeaders(templateHeaders, uploadedFileHeaders);
        expect(component.validateColumnHeaders).toHaveBeenCalled();
        expect(component.validateColumnHeaders).toHaveBeenCalledWith(
            templateHeaders,
            uploadedFileHeaders
        );
        expect(component.missingHeaders.length).toBe(1);
    });

    it('should test uploaded file has no column headers matching those in template', () => {
        const uploadedFileHeaders = ['product', 'qty'];
        const templateHeaders = ['product_name', 'quantity'];
        spyOn(component, 'validateColumnHeaders').and.callThrough();
        component.validateColumnHeaders(templateHeaders, uploadedFileHeaders);
        expect(component.validateColumnHeaders).toHaveBeenCalled();
        expect(component.validateColumnHeaders).toHaveBeenCalledWith(
            templateHeaders,
            uploadedFileHeaders
        );
        expect(component.missingHeaders.length).toBe(2);
    });

    it('should test header extraction', async () => {
        spyOn(component, 'extractTemplateHeaders').and.callThrough();
        component.templateFilePath =
            '../../../../../assets/excel/bulk_stock_upload_template.xlsx';
        await component.extractTemplateHeaders();
        expect(component.extractTemplateHeaders).toHaveBeenCalled();
        expect(component.templateColumnHeaders?.length).toBe(2);
    });

    it('should test uploadFile with mappings', () => {
        spyOn(component, 'uploadFile').and.callThrough();
        component.fieldMappings = {
            product: 'Product Name',
            quantity: 'Quantity',
        };
        component.store = 'process-patient-file-upload';
        component.uploadFile();
        expect(component.uploadFile).toHaveBeenCalledWith();
    });

    it('should test previous step function', () => {
        spyOn(component, 'previousStep').and.callThrough();
        component.handleStepChange({
            index: 0,
            step: new NbStepComponent(NbStepperComponent),
            previouslySelectedIndex: 0,
            previouslySelectedStep: new NbStepComponent(NbStepperComponent),
        });
        component.previousStep();
        expect(component.previousStep).toHaveBeenCalledWith();
    });

    it('should test downloadTemplateFile', () => {
        const mockDocument = new MockDocumentClass();

        spyOn(document, 'createElement').and.returnValue({
            click() {
                return true;
            },
            remove() {
                return true;
            },
        } as any);
        spyOn(document.body, 'appendChild').and.returnValue(
            mockDocument.body.appendChild as any
        );
        spyOn(component, 'downloadTemplateFile').and.callThrough();

        component.downloadTemplateFile();
        expect(component.downloadTemplateFile).toHaveBeenCalled();
    });

    it('should redirect to inventory list page when redirectURL is provided', () => {
        spyOn(component['$state'], 'go');

        component.redirectURL = 'app.advantage.inventory.inventory_adjustments';
        component.processUpload(of({}));

        expect(component['$state'].go).toHaveBeenCalledWith(
            'app.advantage.inventory.inventory_adjustments'
        );
    });

    it('should not redirect when redirectURL is not provided', () => {
        spyOn(component['$state'], 'go');

        component.redirectURL = '';
        component.processUpload(of({}));

        expect(component['$state'].go).not.toHaveBeenCalled();
    });
});

describe('SilFileUploaderComponent', () => {
    let component: SilFileUploaderComponent;
    let fixture: ComponentFixture<SilFileUploaderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilFileUploaderComponent, NbStepperComponent],
            imports: [mockPipe('fileExtension')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: silStoresServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StepperService, useClass: StepperServiceStub },
                FileExtensionPipe,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SilFileUploaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test handleFile with the accepted file formart (.xls)', () => {
        component.clearFile();
        component.formatBytes(0);
        component.formatBytes(30);
        component.formatBytes(30, 0);
        component.acceptedFileTypes =
            'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fetch('../../../../../assets/excel/test.xls')
            .then(res => res.blob())
            .then(blob => {
                const convertedFile = new File([blob], 'text.xls', {
                    type: 'application/vnd.ms-excel',
                });
                const mockFileUploadEvent = {
                    target: {
                        files: [convertedFile],
                    },
                };
                spyOn(component, 'handleFile').and.callThrough();
                component.handleFile(mockFileUploadEvent);
                expect(component.handleFile).toHaveBeenCalledWith(
                    mockFileUploadEvent
                );
            });
        expect(component.handleFile).toBeTruthy();
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

    createNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('UploaderComponent: HttpError', () => {
    let component: SilFileUploaderComponent;
    let fixture: ComponentFixture<SilFileUploaderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilFileUploaderComponent, NbStepperComponent],
            imports: [mockPipe('fileExtension')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StepperService, useClass: StepperServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SilFileUploaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test uploadFile with nestedPrimaryKey', () => {
        spyOn(component, 'uploadFile').and.callThrough();
        component.nestedPrimaryKey = '123';
        component.uploadFile();
        expect(component.uploadFile).toHaveBeenCalledWith();
    });
});
