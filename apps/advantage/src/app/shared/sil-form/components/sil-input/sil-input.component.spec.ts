import { SilInputComponent } from './sil-input.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormControl } from '@angular/forms';
import { provideEnvironmentNgxMask, NgxMaskDirective } from 'ngx-mask';

describe('SilInputComponent', () => {
    let component: SilInputComponent;
    let fixture: ComponentFixture<SilInputComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilInputComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [NgxMaskDirective],
            providers: [provideEnvironmentNgxMask()],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilInputComponent);
        component = fixture.componentInstance;
        component.field = { formControl: new FormControl(), props: {} };
        fixture.detectChanges();
    });

    it('should create', () => {
        component.getType();
        expect(component).toBeTruthy();
    });

    it('should have initial showPassword as false', () => {
        expect(component.showPassword).toBeFalse();
    });

    it('should toggle showPassword', () => {
        expect(component.showPassword).toBeFalse();
        component.toggleShowPassword();
        expect(component.showPassword).toBeTrue();
        component.toggleShowPassword();
        expect(component.showPassword).toBeFalse();
    });

    it('should return correct input type based on showPassword', () => {
        component.showPassword = false;
        expect(component.getInputType()).toBe('password');
        component.showPassword = true;
        expect(component.getInputType()).toBe('text');
    });
});
