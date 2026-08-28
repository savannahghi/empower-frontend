import { SilFormCheckboxComponent } from './sil-checkbox.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

describe('SilFormCheckboxComponent', () => {
    let component: SilFormCheckboxComponent;
    let fixture: ComponentFixture<SilFormCheckboxComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule],
            declarations: [SilFormCheckboxComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [FieldType],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilFormCheckboxComponent);
        component = fixture.componentInstance;
        component.field = { formControl: new FormControl(), props: {} };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
