import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedScreeningComponent } from './finished-screening.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('FinishedScreeningComponent', () => {
    let component: FinishedScreeningComponent;
    let fixture: ComponentFixture<FinishedScreeningComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FinishedScreeningComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(FinishedScreeningComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
