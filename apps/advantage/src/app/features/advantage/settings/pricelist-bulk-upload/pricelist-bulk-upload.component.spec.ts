import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { PricelistBulkUploadComponent } from './pricelist-bulk-upload.component';
import { Pipe, PipeTransform } from '@angular/core';

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
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

describe('PricelistBulkUploadComponent', () => {
    let component: PricelistBulkUploadComponent;
    let fixture: ComponentFixture<PricelistBulkUploadComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PricelistBulkUploadComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: TranslateService, useClass: TranslateServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PricelistBulkUploadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test trivial funtions', () => {
        const event = {};
        component.getFilteredResponse(event);
        expect(component).toBeTruthy();
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
});
