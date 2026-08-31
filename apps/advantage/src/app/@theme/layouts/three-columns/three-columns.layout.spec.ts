import { ThreeColumnsLayoutComponent } from './three-columns.layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('ThreeColumnsLayoutComponent', () => {
    let component: ThreeColumnsLayoutComponent;
    let fixture: ComponentFixture<ThreeColumnsLayoutComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ThreeColumnsLayoutComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ThreeColumnsLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
