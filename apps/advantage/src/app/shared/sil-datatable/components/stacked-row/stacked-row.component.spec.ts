import { StackedRowComponent } from './stacked-row.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { UIRouterGlobals } from '@uirouter/angular';

const uIRouterGlobalsStub = {
    params: {
        id: '112',
    },
    current: {
        data: { apiList: [], defaultParams: {}, extraPayload: { id: '123' } },
        name: 'state',
    },
};

describe('StackedRowComponent', () => {
    let component: StackedRowComponent;
    let fixture: ComponentFixture<StackedRowComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [StackedRowComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StackedRowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test nestedProperty', () => {
        spyOn(component, 'nestedProperty').and.callThrough();
        const path = 'path';
        component.nestedProperty({}, path);
        expect(component.nestedProperty).toHaveBeenCalledWith({}, path);
    });

    it('should test nestedProperty', () => {
        spyOn(component, 'nestedProperty').and.callThrough();
        const path = null;
        component.nestedProperty({}, path);
        expect(component.nestedProperty).toHaveBeenCalledWith({}, path);
    });

    it('should test toggleModal method', () => {
        spyOn(component, 'toggleModal').and.callThrough();
        component.toggleModal('adjudicationHistory');
        expect(component.toggleModal).toHaveBeenCalled();
    });

    it('should set filterParams and call toggleModal when onAdjudicationHistorySelected is called', () => {
        const mockRow = { id: 'test-row-id' };

        spyOn(component, 'toggleModal').and.callThrough();

        component.onAdjudicationHistorySelected(mockRow);

        expect(component.filterParams).toEqual({ invoice_line: 'test-row-id' });

        expect(component.toggleModal).toHaveBeenCalledWith(
            'adjudicationHistory'
        );
    });
});
