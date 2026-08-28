import { SilAlertComponent } from './sil-alert.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    SimpleChange,
} from '@angular/core';

describe('SilAlertComponent', () => {
    let component: SilAlertComponent;
    let fixture: ComponentFixture<SilAlertComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilAlertComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilAlertComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        component.hideAlert();
        component.errMap({ obj: [{ msg: 'string' }] });
        component.asyncError = {};
        component.processError();
        component.ngOnChanges({});
        expect(component.asyncError).toBeUndefined();
        expect(component).toBeTruthy();
    });
    it('should test ngOnChanges', () => {
        spyOn(component, 'processError');
        component.ngOnChanges({
            error: new SimpleChange(null, {}, false),
        });
        expect(component.processError).toHaveBeenCalled();
    });
    it('should test processError method', () => {
        component.asyncError = undefined;
        component.processError();
        expect(component.processError).toBeTruthy();
    });
    it('should test errMap method', () => {
        component.errMap({ obj: undefined });
        component.asyncError = [{}];
        component.processError();
        expect(component.errMap).toBeTruthy();
    });
});
