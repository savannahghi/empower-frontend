import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { VisitMedicationRequestComponent } from './visit-medication-request.component';

describe('VisitMedicationRequestComponent', () => {
    let component: VisitMedicationRequestComponent;
    let fixture: ComponentFixture<VisitMedicationRequestComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VisitMedicationRequestComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(VisitMedicationRequestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
