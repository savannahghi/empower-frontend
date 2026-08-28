import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
} from '@angular/core/testing';
import { EmpowerWelcomeComponent } from './empower-welcome.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('EmpowerWelcomeComponent', () => {
    let component: EmpowerWelcomeComponent;
    let fixture: ComponentFixture<EmpowerWelcomeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EmpowerWelcomeComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EmpowerWelcomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set welcome element styles after timeout', fakeAsync(() => {
        const mockElement = document.createElement('div');
        mockElement.classList.add('welcome-height');
        document.body.appendChild(mockElement);

        spyOn(document, 'querySelector').and.returnValue(mockElement);

        component.ngOnInit();

        tick(500);

        expect(mockElement.style.display).toBe('block');
        expect(mockElement.style.visibility).toBe('visible');
        expect(mockElement.style.opacity).toBe('1');

        document.body.removeChild(mockElement);
    }));

    it('should handle case when welcome element is not found', fakeAsync(() => {
        spyOn(document, 'querySelector').and.returnValue(null);

        expect(() => {
            component.ngOnInit();
            tick(500);
        }).not.toThrow();
    }));
});
