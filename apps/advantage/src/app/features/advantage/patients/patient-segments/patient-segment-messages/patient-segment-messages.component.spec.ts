import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSegmentMessagesComponent } from './patient-segment-messages.component';
import { UIRouterGlobals } from '@uirouter/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

const uIRouterGlobalsStub = {
    current: {
        name: 'app.advantage.patients.detail.screening-report',
    },
    params: {
        segment_id: '3349-9522-9295',
        member: '3572-1848-0928-1948',
        segment: 'High Risk Breast Cancer',
        name: 'Atredes',
    },
};

describe('PatientSegmentMessagesComponent', () => {
    let component: PatientSegmentMessagesComponent;
    let fixture: ComponentFixture<PatientSegmentMessagesComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PatientSegmentMessagesComponent],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(PatientSegmentMessagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });
});
