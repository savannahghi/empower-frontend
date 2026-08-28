import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingWrapperComponent } from './onboarding-wrapper.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { UIRouterGlobals } from '@uirouter/angular';

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params() {
        return { appointment_id: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { appointment_id: 1 };
        },
    },
};

describe('OnboardingWrapperComponent', () => {
    let component: OnboardingWrapperComponent;
    let fixture: ComponentFixture<OnboardingWrapperComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OnboardingWrapperComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(OnboardingWrapperComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        spyOn(component, 'ngOnInit').and.callThrough();

        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
        expect(component).toBeTruthy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
