import { SilDatatableSearchComponent } from './sil-datatable-search.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Transition, UIRouterGlobals } from '@uirouter/angular';

class TransitionStub {
    params() {
        return { search: 'Leo' };
    }
}

class TransitionStub2 {
    params() {
        return {};
    }
}

const uIRouterGlobalsStub = {
    params: {
        search: 'Hello',
    },
};
describe('SilDatatableSearchComponent', () => {
    let component: SilDatatableSearchComponent;
    let fixture: ComponentFixture<SilDatatableSearchComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule],
            declarations: [SilDatatableSearchComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilDatatableSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test searchValueEmit method', () => {
        component.ngOnInit();
        spyOn(component, 'removePageParam').and.callThrough();
        component.paginationData = {
            current_page: 2,
        };
        component.searchValueEmit('searched');
        component.removePageParam();
        expect(component).toBeTruthy();
        component.setSearchParam();
        expect(component.searchParam).toBe('search');
        component.searchValueEmit('07324');
        component.setSearchParam();
        expect(component.searchParam).toBe('search');
    });

    it('should test removePageParam method when pageParam is defined', () => {
        spyOn(component, 'removePageParam').and.callThrough();
        component.paginationData = {
            current_page: 2,
        };
        component.pageParam = {};
        component.removePageParam();
        expect(component.removePageParam).toHaveBeenCalled();
        expect(component.pageParam.page).toBe(undefined);
    });

    it('should test removePageParam method when pageParam is undefined', () => {
        spyOn(component, 'removePageParam').and.callThrough();
        component.paginationData = {
            current_page: 1,
        };
        component.removePageParam();
        expect(component.removePageParam).toHaveBeenCalled();
    });
});

describe('SilDatatableSearchComponent Error', () => {
    let component: SilDatatableSearchComponent;
    let fixture: ComponentFixture<SilDatatableSearchComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule],
            declarations: [SilDatatableSearchComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Transition, useClass: TransitionStub2 },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilDatatableSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test when searchValue is empty', () => {
        component.ngOnInit();
        component.paginationData = {
            current_page: 2,
        };
        expect(component.searchValue).toBe('');
    });
});
