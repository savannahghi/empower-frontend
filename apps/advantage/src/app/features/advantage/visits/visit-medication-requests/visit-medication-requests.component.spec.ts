import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UIRouterGlobals } from '@uirouter/angular';
import { VisitMedicationRequestsComponent } from './visit-medication-requests.component';

const uIRouterGlobalsStub = {
    current: {
        name: 'app.advantage.visits.detail.',
    },
    params() {
        return { id: '8764-0284', appointment_id: 1 };
    },
};

describe('VisitMedicationRequestsComponent', () => {
    let component: VisitMedicationRequestsComponent;
    let fixture: ComponentFixture<VisitMedicationRequestsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [VisitMedicationRequestsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VisitMedicationRequestsComponent);
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
