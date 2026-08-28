import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
} from '@angular/core/testing';
import { RepeatTypeComponent } from './repeat-type.component';
import { FieldArrayType, FieldGroupTypeConfig } from '@ngx-formly/core';
import { FormlyModule } from '@ngx-formly/core';
import { FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('RepeatTypeComponent', () => {
    let component: RepeatTypeComponent;
    let fixture: ComponentFixture<RepeatTypeComponent>;
    let mockField: FieldArrayType<FieldGroupTypeConfig>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RepeatTypeComponent],
            providers: [CommonModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [FormlyModule.forRoot()],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RepeatTypeComponent);
        component = fixture.componentInstance;

        mockField = {
            onPopulate: () => {},
            add: () => {},
            remove: () => {},
            showError: () => {},
            key: 'person',
            formControl: new FormArray([]), // FormArray for FieldArrayType
            to: {},
            id: '12312',
            model: [],
            formState: {},
            options: {},
            fieldGroup: [],
            props: {},
            _build: {},
        } as unknown as FieldArrayType<FieldGroupTypeConfig>;
        component.field = mockField;
    });
    it('should add a new item when fieldArray is empty and fieldGroup is empty', fakeAsync(() => {
        spyOn(component, 'add');
        mockField = {
            onPopulate: () => {},
            add: () => {},
            remove: () => {},
            showError: () => {},
            key: 'person',
            formControl: new FormArray([]), // FormArray for FieldArrayType
            to: {},
            id: '12312',
            model: [],
            formState: {},
            options: {},
            fieldGroup: [
                {
                    props: {
                        hasIcon: true,
                    },
                },
            ],
            fieldArray: {
                props: {
                    hasIcon: true,
                },
                fieldGroup: undefined,
            },
            props: {
                hasIcon: true,
            },
            _build: {},
        } as unknown as FieldArrayType<FieldGroupTypeConfig>;
        component.field = mockField;
        fixture.detectChanges();
        tick(201);
        expect(component.add).not.toHaveBeenCalled();
    }));

    it('should add a new item when fieldGroup is empty', fakeAsync(() => {
        spyOn(component, 'add');
        mockField = {
            onPopulate: () => {},
            add: () => {},
            remove: () => {},
            showError: () => {},
            key: 'person',
            formControl: new FormArray([]), // FormArray for FieldArrayType
            to: {},
            id: '12312',
            model: [],
            formState: {},
            options: {},
            fieldGroup: [],
            props: {},
            _build: {},
        } as unknown as FieldArrayType<FieldGroupTypeConfig>;
        component.field = mockField;
        fixture.detectChanges();
        tick(200);
        expect(component.add).toHaveBeenCalled();
    }));

    it('should add a new item when fieldGroup is not empty', fakeAsync(() => {
        spyOn(component, 'add');
        mockField = {
            onPopulate: () => {},
            add: () => {},
            remove: () => {},
            showError: () => {},
            key: 'person',
            formControl: new FormArray([]), // FormArray for FieldArrayType
            to: {},
            id: '12312',
            model: [],
            formState: {},
            options: {},
            fieldGroup: [],
            props: {},
            _build: {},
            fieldArray: {
                fieldGroup: undefined,
            },
        } as unknown as FieldArrayType<FieldGroupTypeConfig>;
        component.field = mockField;
        fixture.detectChanges();
        tick(200);
        expect(component.add).toHaveBeenCalled();
    }));
});
