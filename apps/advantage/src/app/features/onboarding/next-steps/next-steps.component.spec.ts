import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextStepsComponent } from './next-steps.component';

describe('NextStepsComponent', () => {
    let component: NextStepsComponent;
    let fixture: ComponentFixture<NextStepsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NextStepsComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(NextStepsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
