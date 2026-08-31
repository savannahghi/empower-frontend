import { SilFormDatepickerComponent } from './sil-datepicker.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    InjectionToken,
} from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

class FieldTypeStub {
    to() {
        return () => {};
    }
}

describe('SilFormDatepickerComponent: without props.dateFormat', () => {
    let component: SilFormDatepickerComponent;
    let fixture: ComponentFixture<SilFormDatepickerComponent>;

    const injectionToken = new InjectionToken('');

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [SilFormDatepickerComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: injectionToken, useValue: {} },
                { provide: FieldType, useClass: FieldTypeStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilFormDatepickerComponent);
        component = fixture.componentInstance;
        component.field = { formControl: new FormControl('value'), props: {} };
        fixture.detectChanges();
    });

    it('should test create', () => {
        component.field = { formControl: new FormControl(null), props: {} };
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should test dateChange method', () => {
        const event = {};
        component.field = { formControl: new FormControl(''), props: {} };
        spyOn(component, 'dateChange').and.callThrough();
        component.dateChange(event);
        expect(component.dateChange).toHaveBeenCalled();
    });
});

class FieldTypeStub2 {
    to() {
        () => {};
    }
}

describe('SilFormDatepickerComponent: with props.dateFormat', () => {
    let component: SilFormDatepickerComponent;
    let fixture: ComponentFixture<SilFormDatepickerComponent>;

    const injectionToken = new InjectionToken('');

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [SilFormDatepickerComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: injectionToken, useValue: {} },
                { provide: FieldType, useClass: FieldTypeStub2 },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilFormDatepickerComponent);
        component = fixture.componentInstance;
        component.field = {
            formControl: new UntypedFormControl('Value'),
            props: {
                dateFormat: 'YYYY-MM-DD',
            },
        };
        fixture.detectChanges();
    });

    it('should test create', () => {
        component.field = {
            formControl: new UntypedFormControl(null),
            props: {
                dateFormat: 'YYYY-MM-DD',
            },
        };
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should create with date format', () => {
        component.props.dateFormat = 'YYYY-MM-DD';
        component.field = {
            formControl: new UntypedFormControl('Value'),
            props: {
                dateFormat: 'YYYY-MM-DD',
            },
        };
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should test dateChange method with dateFormat', () => {
        const event = {
            format: () => new Date(),
        };
        component.props.dateFormat = 'YYYY-MM-DD';
        component.field = {
            formControl: new UntypedFormControl('Value'),
            model: {},
            key: 'date_field',
            props: {
                dateFormat: 'YYYY-MM-DD',
            },
        };
        fixture.detectChanges();
        component.dateChange(event);
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
