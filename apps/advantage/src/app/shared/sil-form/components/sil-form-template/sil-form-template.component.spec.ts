import { SilFormTemplateComponent } from './sil-form-template.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { SkikaSafePipe } from '../../../sil-pipes/skika-safety.pipe';
import { FormControl } from '@angular/forms';

describe('SilFormTemplateComponent', () => {
    let component: SilFormTemplateComponent;
    let fixture: ComponentFixture<SilFormTemplateComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilFormTemplateComponent, SkikaSafePipe],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilFormTemplateComponent);
        component = fixture.componentInstance;
        component.field = { formControl: new FormControl(), props: {} };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
