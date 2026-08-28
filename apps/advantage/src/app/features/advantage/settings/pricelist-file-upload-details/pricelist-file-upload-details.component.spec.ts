import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricelistFileUploadDetailsComponent } from './pricelist-file-upload-details.component';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { BehaviorSubject, of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { StateService } from '@uirouter/angular';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { PriceListFileUploadDetailsModel } from '../../models';

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
        return of({});
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
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
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
            organisation: '123',
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
}

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

class CookieServiceStub {
    setLanguageCookie() {
        return 'en';
    }
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
    }
}

const mockPricelistFIleUploadResponse: PriceListFileUploadDetailsModel = {
    id: '21a20ff5-b19d-4bcf-b15d-e294a06af44a',
    file_name: 'bulk_upload_pricelist_template.xlsx',
    upload_file_url:
        'https://example.invalid/fixtures/pricelist.xlsx',
    failed_upload_file_url:
        'https://example.invalid/fixtures/pricelist.xlsx',
    active: true,
    created: '2025-02-11T15:11:30.418307+03:00',
    created_by: null,
    updated: '2025-02-11T15:11:30.418321+03:00',
    updated_by: null,
    status: 'COMPLETED',
    success_count: 0,
    fail_count: 1,
    mapping: {
        name: 'Product Name',
        product_type: 'Product Type',
        selling_price: 'Selling Price',
        preferred_name: 'Product Name',
        purchasing_price: 'Purchase Price',
    },
    organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
    upload_file: 'c80a81ff-c647-4f35-ad8d-d503a5851e63',
    failed_uploads_file: 'b58501d8-25ee-49bb-89b6-fdc5a5ba264e',
    pricelist: '987a7674-b3ed-498e-a6c8-523c6b554b53',
};

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

describe('PricelistFileUploadDetailsComponent', () => {
    let component: PricelistFileUploadDetailsComponent;
    let fixture: ComponentFixture<PricelistFileUploadDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PricelistFileUploadDetailsComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('titleCase'),
                mockPipe('statusColor'),
                mockPipe('replaceWith'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                ErrorHandlerService,
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
            ],
        });
        fixture = TestBed.createComponent(PricelistFileUploadDetailsComponent);
        component = fixture.componentInstance;
        component.pricelistUploadFileObservable = of({
            id: '1234',
        });

        fixture.detectChanges();
    });

    it('should test ngOnit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
        expect(component).toBeTruthy();
    });

    it('should test receiveUploaderData method', () => {
        spyOn(component, 'receivePriceListUploadData').and.callThrough();
        component.receivePriceListUploadData(mockPricelistFIleUploadResponse);
        expect(component.receivePriceListUploadData).toHaveBeenCalledWith(
            mockPricelistFIleUploadResponse
        );
    });

    it('should test handleErrorFxn method', () => {
        spyOn(component, 'handleErrorFxn').and.callThrough();
        component.handleErrorFxn({});
        expect(component.handleErrorFxn).toHaveBeenCalledWith({});
    });

    it('should test getUploadedDataInfo method', () => {
        spyOn(component, 'getUploadedDataInfo').and.callThrough();
        component.getUploadedDataInfo();
        expect(component.getUploadedDataInfo).toHaveBeenCalled();
    });

    it('should log a warning when uploadedDataInfo is not set', () => {
        spyOn(console, 'warn');

        component.uploadedDataInfo = null; // Simulating missing data
        component.actionToDownloadFile('original_file');

        expect(console.warn).toHaveBeenCalledWith(
            'actionToDownloadFile - No uploaded data info available'
        );
    });

    it('should log a warning when fileUrl is undefined', () => {
        spyOn(console, 'warn');

        component.uploadedDataInfo = {
            id: 'mock-id',
            file_name: 'mock-file-name',
            upload_file_url: null,
            failed_upload_file_url: null,
            active: true,
            created: 'mock-created-date',
            created_by: null,
            updated: 'mock-updated-date',
            updated_by: null,
            status: 'mock-status',
            success_count: 0,
            fail_count: 0,
            mapping: {
                name: 'mock-name',
                product_type: 'mock-product-type',
                selling_price: 'mock-selling-price',
                preferred_name: 'mock-preferred-name',
                purchasing_price: 'mock-purchasing-price',
            },
            organisation: 'mock-organisation',
            upload_file: 'mock-upload-file',
            failed_uploads_file: 'mock-failed-uploads-file',
            pricelist: 'mock-pricelist',
        };
        component.actionToDownloadFile('original_file');

        expect(console.warn).toHaveBeenCalledWith(
            'actionToDownloadFile - File URL is undefined'
        );
    });

    it('should test actionToDownloadFile method with original_file context', () => {
        const mockDocument = new MockDocumentClass();
        component.uploadedDataInfo = mockPricelistFIleUploadResponse;

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
        spyOn(component, 'actionToDownloadFile').and.callThrough();

        component.actionToDownloadFile('original_file');
        expect(component.actionToDownloadFile).toHaveBeenCalledWith(
            'original_file'
        );
    });

    it('should test actionToDownloadFile method with failed_upload_file_url context', () => {
        const mockDocument = new MockDocumentClass();
        component.uploadedDataInfo = mockPricelistFIleUploadResponse;

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
        spyOn(component, 'actionToDownloadFile').and.callThrough();

        component.actionToDownloadFile('failed_upload_file_url');
        expect(component.actionToDownloadFile).toHaveBeenCalledWith(
            'failed_upload_file_url'
        );
    });
});

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Error fetching upload details'));
        return sub;
    }
}

describe('PricelistFileUploadDetailsComponent Error Path', () => {
    let component: PricelistFileUploadDetailsComponent;
    let fixture: ComponentFixture<PricelistFileUploadDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PricelistFileUploadDetailsComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('titleCase'),
                mockPipe('statusColor'),
                mockPipe('replaceWith'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                ErrorHandlerService,
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
            ],
        });
        fixture = TestBed.createComponent(PricelistFileUploadDetailsComponent);
        component = fixture.componentInstance;
        component.pricelistUploadFileObservable = of({
            id: '1234',
        });

        fixture.detectChanges();
    });

    it('should test getUploadedDataInfo method', () => {
        spyOn(component, 'getUploadedDataInfo').and.callThrough();
        component.getUploadedDataInfo();
        expect(component.getUploadedDataInfo).toHaveBeenCalled();
    });
});
