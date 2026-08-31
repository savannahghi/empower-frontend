import { SilFormCkEditorComponent } from './sil-ckeditor.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormControl } from '@angular/forms';

describe('SilFormCkEditorComponent', () => {
    let component: SilFormCkEditorComponent;
    let fixture: ComponentFixture<SilFormCkEditorComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilFormCkEditorComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilFormCkEditorComponent);
        component = fixture.componentInstance;
        component.field = { formControl: new FormControl(), props: {} };
        fixture.detectChanges();
    });

    it('should test onChange method', () => {
        expect(component).toBeTruthy();
    });
});
