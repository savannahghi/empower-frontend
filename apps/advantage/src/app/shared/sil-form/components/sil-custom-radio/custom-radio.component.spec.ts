import { FormlyCustomRadioComponent } from './custom-radio.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormControl } from '@angular/forms';

describe('FormlyCustomRadioComponent', () => {
    let component: FormlyCustomRadioComponent;
    let fixture: ComponentFixture<FormlyCustomRadioComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FormlyCustomRadioComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormlyCustomRadioComponent);
        component = fixture.componentInstance;
        component.field = { formControl: new FormControl(), props: {} };
        fixture.detectChanges();
    });

    it('should create', () => {
        component.radioChange(true);
        expect(component).toBeTruthy();
    });
});
