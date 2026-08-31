import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UIRouterGlobals } from '@uirouter/core';
import { cleanStylesFromDOM } from '../../../../../test';
import { ErrorPageComponent } from './error-page.component';

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params: {
        error: '403',
    },
    $current: {
        is: () => true,
    },
};

describe('ErrorPageComponent', () => {
    let component: ErrorPageComponent;
    let fixture: ComponentFixture<ErrorPageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ErrorPageComponent],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(ErrorPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });
});
