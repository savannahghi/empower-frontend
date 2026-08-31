import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { SilRadioComponent } from './sil-radio.component';

describe('SilRadioComponent', () => {
    let component: SilRadioComponent;
    let fixture: ComponentFixture<SilRadioComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilRadioComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilRadioComponent);
        component = fixture.componentInstance;
        component.field = { formControl: new FormControl(), props: {} };
        fixture.detectChanges();
    });

    it('should test radioChange method', () => {
        component.radioChange({});
        expect(component).toBeTruthy();
        expect(component.radioChange).toBeTruthy();
    });
});
