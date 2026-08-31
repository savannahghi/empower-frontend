import { PageHeaderComponent } from './page-header.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('PageHeaderComponent', () => {
    let component: PageHeaderComponent;
    let fixture: ComponentFixture<PageHeaderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PageHeaderComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PageHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
