import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UIRouterGlobals } from '@uirouter/angular';

import { PatientMedicationRequestsComponent } from './patient-medication-requests.component';

const uIRouterGlobalsStub = {
    current: {
        name: 'app.advantage.patients.detail.',
    },
    params() {
        return { id: '8764-0284', appointment_id: 1 };
    },
};

describe('PatientMedicationRequestsComponent: ', () => {
    let component: PatientMedicationRequestsComponent;
    let fixture: ComponentFixture<PatientMedicationRequestsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [PatientMedicationRequestsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PatientMedicationRequestsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test component functions', () => {
        spyOn(component, 'setFilter').and.callThrough();
        component.setFilter({ id: 1 });
        expect(component.setFilter).toHaveBeenCalled();
    });
});
