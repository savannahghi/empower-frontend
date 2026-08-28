import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepsCompletionComponent } from './steps-completion.component';

describe('StepsCompletionComponent', () => {
    let component: StepsCompletionComponent;
    let fixture: ComponentFixture<StepsCompletionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StepsCompletionComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(StepsCompletionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
