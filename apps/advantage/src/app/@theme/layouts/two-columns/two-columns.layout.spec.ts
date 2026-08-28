import { TwoColumnsLayoutComponent } from './two-columns.layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('TwoColumnsLayoutComponent', () => {
    let component: TwoColumnsLayoutComponent;
    let fixture: ComponentFixture<TwoColumnsLayoutComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TwoColumnsLayoutComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TwoColumnsLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
