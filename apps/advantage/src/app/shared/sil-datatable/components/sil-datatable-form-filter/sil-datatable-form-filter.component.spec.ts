import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SilDatatableFormFilterComponent } from './sil-datatable-form-filter.component';

describe('SilDatatableFormFilterComponent', () => {
    let component: SilDatatableFormFilterComponent;
    let fixture: ComponentFixture<SilDatatableFormFilterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SilDatatableFormFilterComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilDatatableFormFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
