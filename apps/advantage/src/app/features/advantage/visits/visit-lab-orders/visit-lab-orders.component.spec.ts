import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UIRouterGlobals } from '@uirouter/angular';
import { VisitLabOrdersComponent } from './visit-lab-orders.component';

const uIRouterGlobalsStub = {
    current: {
        name: 'app.advantage.visits.detail.',
    },
    params() {
        return { id: '8764-0284', appointment_id: 1 };
    },
};

describe('VisitLabOrdersComponent', () => {
    let component: VisitLabOrdersComponent;
    let fixture: ComponentFixture<VisitLabOrdersComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [VisitLabOrdersComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VisitLabOrdersComponent);
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
