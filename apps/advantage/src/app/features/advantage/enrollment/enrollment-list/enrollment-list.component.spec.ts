import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnrollmentListComponent } from './enrollment-list.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('EnrollmentListComponent', () => {
    let component: EnrollmentListComponent;
    let fixture: ComponentFixture<EnrollmentListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EnrollmentListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(EnrollmentListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
