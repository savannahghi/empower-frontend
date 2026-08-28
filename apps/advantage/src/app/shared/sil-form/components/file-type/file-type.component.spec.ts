import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldTypeConfig } from '@ngx-formly/core';
import {
    ImgExifService,
    ImgMaxPXSizeService,
    ImgMaxSizeService,
    Ng2ImgMaxService,
} from 'ng2-img-max';
import { BehaviorSubject, of } from 'rxjs';
import { FormlyFieldFileComponent } from './file-type.component';

class Ng2ImgMaxServiceStub {
    compressImage() {
        return of(() => {});
    }
    resize() {
        return of(() => {});
    }
}

describe('FormlyFieldFileComponent', () => {
    let component: FormlyFieldFileComponent;
    let fixture: ComponentFixture<FormlyFieldFileComponent>;
    let mockField: FieldTypeConfig;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FormlyFieldFileComponent],
            imports: [],
            providers: [
                { provide: Ng2ImgMaxService, useClass: Ng2ImgMaxServiceStub },
                { provide: ImgMaxSizeService, useClass: Ng2ImgMaxServiceStub },
                {
                    provide: ImgMaxPXSizeService,
                    useClass: Ng2ImgMaxServiceStub,
                },
                { provide: ImgExifService, useClass: Ng2ImgMaxServiceStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(FormlyFieldFileComponent);
        component = fixture.componentInstance;
        spyOnProperty(component, 'props', 'get').and.returnValue({
            attributes: {},
            buttons: [],
            addFile: () => {},
            fileEvent: () => {},
        });
        mockField = {
            key: 'item',
            props: {
                addFile: () => {},
                fileEvent: () => {},
            },
            id: '12',
            form: new FormGroup({ name: new FormControl() }),
            options: {},
            formControl: new FormControl('name'),
        };
        component.field = mockField;
        await component.loadNgImgMaxService();
        fixture.detectChanges();
    });

    it('should create', () => {
        const mockFile = new File(['some file content'], 'test-file.txt', {
            type: 'text/plain',
        });
        const mockPdfFile = new File(['some file content'], 'test-file.txt', {
            type: 'application/pdf',
        });
        const event = {
            target: {
                files: [mockFile, mockPdfFile],
            },
        };
        const pdfEvent = {
            target: {
                files: [mockPdfFile],
            },
        };
        const props = {
            fileEvent: () => {},
        };
        component.ng2ImgMaxService = {
            compressImage: () => {
                return of(() => {});
            },
            resize: () => {
                return of({ name: '2311' });
            },
        };
        component.getSanitizedImageUrl(mockFile);
        component.onChange(event, props, {});
        component.onChange(pdfEvent, props, {});
        component.selectedFiles = [mockFile];
        component.onDelete(1);
        expect(component).toBeTruthy();
    });

    it('should return true if the file is an image', () => {
        const file = new File([''], 'test-image.png', { type: 'image/png' });
        const result = component.isImage(file);
        expect(result).toBe(true);
    });

    it('should return false if the file is not an image', () => {
        const file = new File([''], 'test-file.txt', { type: 'text/plain' });
        const result = component.isImage(file);
        expect(result).toBe(false);
    });
});

class Ng2ImgMaxServiceStubCompressError {
    compressImage() {
        const sub = new BehaviorSubject('');
        const file = {
            resizedFile: {
                name: 'filename',
            },
        };
        sub.error(file);
        return sub;
    }
    resize() {
        return of(() => {});
    }
}

describe('FormlyFieldFileComponent compressImage fails', () => {
    let component: FormlyFieldFileComponent;
    let fixture: ComponentFixture<FormlyFieldFileComponent>;
    let mockField: FieldTypeConfig;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FormlyFieldFileComponent],
            imports: [],
            providers: [
                {
                    provide: Ng2ImgMaxService,
                    useClass: Ng2ImgMaxServiceStubCompressError,
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(FormlyFieldFileComponent);
        component = fixture.componentInstance;
        spyOnProperty(component, 'props', 'get').and.returnValue({
            attributes: {},
            buttons: [],
            addFile: () => {},
            fileEvent: () => {},
        });
        mockField = {
            key: 'item',
            props: {
                addFile: () => {},
                fileEvent: () => {},
            },
            id: '12',
            form: new FormGroup({ name: new FormControl() }),
            options: {},
            formControl: new FormControl('name'),
        };
        component.field = mockField;
        component.loadNgImgMaxService();
        fixture.detectChanges();
    });

    it('should create', () => {
        const mockFile = new File(['some file content'], 'test-file.txt', {
            type: 'text/plain',
        });
        const mockPdfFile = new File(['some file content'], 'test-file.txt', {
            type: 'application/pdf',
        });
        const event = {
            target: {
                files: [mockFile, mockPdfFile],
            },
        };
        const pdfEvent = {
            target: {
                files: [mockPdfFile],
            },
        };
        const props = {
            fileEvent: () => {},
        };
        component.ng2ImgMaxService = {
            compressImage: () => {
                const sub = new BehaviorSubject('');
                const file = {
                    resizedFile: {
                        name: 'filename',
                    },
                };
                sub.error(file);
                return sub;
            },
            resize: () => {
                const sub = new BehaviorSubject('');
                const file = {
                    resizedFile: {
                        name: 'filename',
                    },
                };
                sub.error(file);
                return sub;
            },
        };
        component.getSanitizedImageUrl(mockFile);
        component.isImage(mockFile);
        component.onChange(event, props, {});
        component.onChange(pdfEvent, props, {});
        component.selectedFiles = [mockFile];
        component.onDelete(1);
        expect(component).toBeTruthy();
    });
});

class Ng2ImgMaxServiceStubResizeError {
    compressImage() {
        return of(() => {});
    }
    resize() {
        const sub = new BehaviorSubject('');
        const file = {
            resizedFile: {
                name: 'filename',
            },
        };
        sub.error(file);
        return sub;
    }
}

describe('FormlyFieldFileComponent resize fails', () => {
    let component: FormlyFieldFileComponent;
    let fixture: ComponentFixture<FormlyFieldFileComponent>;
    let mockField: FieldTypeConfig;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FormlyFieldFileComponent],
            imports: [],
            providers: [
                {
                    provide: Ng2ImgMaxService,
                    useClass: Ng2ImgMaxServiceStubResizeError,
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(FormlyFieldFileComponent);
        component = fixture.componentInstance;
        spyOnProperty(component, 'props', 'get').and.returnValue({
            attributes: {},
            buttons: [],
            addFile: () => {},
            fileEvent: () => {},
        });
        mockField = {
            key: 'item',
            props: {
                addFile: () => {},
                fileEvent: () => {},
            },
            id: '12',
            form: new FormGroup({ name: new FormControl() }),
            options: {},
            formControl: new FormControl('name'),
        };
        component.field = mockField;
        fixture.detectChanges();
    });

    it('should create', () => {
        component.ng2ImgMaxService = {
            compressImage: () => {
                return of(() => {});
            },
            resize: () => {
                const sub = new BehaviorSubject('');
                const file = {
                    resizedFile: {
                        name: 'filename',
                    },
                };
                sub.error(file);
                return sub;
            },
        };
        const mockFile = new File(['some file content'], 'test-file.txt', {
            type: 'text/plain',
        });
        const mockPdfFile = new File(['some file content'], 'test-file.txt', {
            type: 'application/pdf',
        });
        const event = {
            target: {
                files: [mockFile, mockPdfFile],
            },
        };
        const pdfEvent = {
            target: {
                files: [mockPdfFile],
            },
        };
        const props = {
            fileEvent: () => {},
        };
        component.getSanitizedImageUrl(mockFile);
        component.isImage(mockFile);
        component.onChange(event, props, {});
        component.onChange(pdfEvent, props, {});
        component.selectedFiles = [mockFile];
        component.onDelete(1);
        expect(component).toBeTruthy();
    });
});
