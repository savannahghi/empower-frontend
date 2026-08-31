import { SilFormDateTimepickerComponent } from './sil-datetimepicker.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    InjectionToken,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

class FieldTypeStub {
    to() {
        return () => {};
    }
}

describe('SilFormDateTimepickerComponent: without props.dateFormat', () => {
    let component: SilFormDateTimepickerComponent;
    let fixture: ComponentFixture<SilFormDateTimepickerComponent>;

    const injectionToken = new InjectionToken('');

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [SilFormDateTimepickerComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: injectionToken, useValue: {} },
                { provide: FieldType, useClass: FieldTypeStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilFormDateTimepickerComponent);
        component = fixture.componentInstance;
        component.field = {
            formControl: new UntypedFormControl('Value'),
            props: {},
        };
        fixture.detectChanges();
    });

    it('should test create', () => {
        component.field = {
            formControl: new UntypedFormControl(null),
            props: {},
        };
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should test dateChange method', () => {
        const event = {};
        component.field = {
            formControl: new UntypedFormControl(''),
            props: {},
        };
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

describe('SilFormDateTimepickerComponent: with props.dateFormat', () => {
    let component: SilFormDateTimepickerComponent;
    let fixture: ComponentFixture<SilFormDateTimepickerComponent>;

    const injectionToken = new InjectionToken('');

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [SilFormDateTimepickerComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: injectionToken, useValue: {} },
                { provide: FieldType, useClass: FieldTypeStub2 },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilFormDateTimepickerComponent);
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
                minimum: 'NOW',
                maximum: 'NOW',
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
