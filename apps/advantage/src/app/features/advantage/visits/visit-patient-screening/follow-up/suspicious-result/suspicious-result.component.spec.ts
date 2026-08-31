import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspiciousResultComponent } from './suspicious-result.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('SuspiciousResultComponent', () => {
    let component: SuspiciousResultComponent;
    let fixture: ComponentFixture<SuspiciousResultComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SuspiciousResultComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(SuspiciousResultComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test getModelData function', () => {
        spyOn(component, 'getModelData').and.callThrough();
        component.getModelData({
            referral_type: 'specialist_referral',
        });
        expect(component.getModelData).toHaveBeenCalled();
    });

    it('should test requestPreviousStep function', () => {
        spyOn(component, 'requestPreviousStep').and.callThrough();

        component.requestPreviousStep();
        expect(component.requestPreviousStep).toHaveBeenCalled();
    });
});
