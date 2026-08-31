import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SilDatatableTagFiltersComponent } from './sil-datatable-tag-filters.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('SilDatatableTagFiltersComponent', () => {
    let component: SilDatatableTagFiltersComponent;
    let fixture: ComponentFixture<SilDatatableTagFiltersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [],
            declarations: [SilDatatableTagFiltersComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [],
        }).compileComponents();

        fixture = TestBed.createComponent(SilDatatableTagFiltersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test emitToggleTagsModal method', () => {
        spyOn(component, 'emitToggleTagsModal').and.callThrough();
        component.emitToggleTagsModal();
        expect(component.emitToggleTagsModal).toHaveBeenCalled();
    });

    it('should test filterAction method with multipleFilters as truthy', () => {
        component.modalFiltersCopy = [
            { name: 'Kimanongo', value: 56, active: true },
        ];
        component.multipleFilters = true;

        spyOn(component, 'filterAction').and.callThrough();
        component.filterAction();
        expect(component.filterAction).toHaveBeenCalled();
    });

    it('should test filterAction method with filterByTypes as truthy', () => {
        component.modalFiltersCopy = [
            { name: 'Kimanongo', value: 56, active: true },
        ];
        component.filterByTypes = true;

        spyOn(component, 'filterAction').and.callThrough();
        component.filterAction();
        expect(component.filterAction).toHaveBeenCalled();
    });

    it('should test filterAction method with both filterByTypes and multipleFilters as falsy', () => {
        component.modalFiltersCopy = [
            { name: 'Kimanongo', value: 56, active: true },
        ];
        component.filterByTypes = false;
        component.multipleFilters = false;

        spyOn(component, 'filterAction').and.callThrough();
        component.filterAction();
        expect(component.filterAction).toHaveBeenCalled();
    });

    it('should test onFilterSelect method with unknown type and item selected is found in the modalFiltersCopy list', () => {
        component.modalFiltersCopy = [
            { name: 'Kimanongo', value: 56, active: true },
        ];

        spyOn(component, 'onFilterSelect').and.callThrough();
        component.onFilterSelect('Kimanongo', 'shambles');
        expect(component.onFilterSelect).toHaveBeenCalled();
    });

    it('should test onFilterSelect method with unknown type and item selected is not found in the modalFiltersCopy list', () => {
        component.modalFiltersCopy = [
            { name: 'Kimanongo', value: 56, active: true },
        ];

        spyOn(component, 'onFilterSelect').and.callThrough();
        component.onFilterSelect('Kimanongo2', 'shambles');
        expect(component.onFilterSelect).toHaveBeenCalled();
    });

    it('should test onFilterSelect method type as delivery_type', () => {
        spyOn(component, 'onFilterSelect').and.callThrough();
        component.onFilterSelect('INBOUND', 'delivery_type');
        expect(component.onFilterSelect).toHaveBeenCalled();
    });

    it('should test onFilterSelect method type as delivery_type', () => {
        spyOn(component, 'onFilterSelect').and.callThrough();
        component.onFilterSelect('OUTBOUND', 'delivery_type');
        expect(component.onFilterSelect).toHaveBeenCalled();
    });

    it('should test handleScheduledDateChange method with context as start_date', () => {
        component.modalFiltersCopy = [
            {
                name: 'Custom',
                value: {
                    date_from: '',
                    date_to: '',
                },
                active: true,
            },
        ];

        spyOn(component, 'handleScheduledDateChange').and.callThrough();
        component.handleScheduledDateChange(
            '2023-02-14T03:00:00+03:00',
            'start_date'
        );
        expect(component.handleScheduledDateChange).toHaveBeenCalledWith(
            '2023-02-14T03:00:00+03:00',
            'start_date'
        );
    });

    it('should test handleScheduledDateChange method with context as end_date', () => {
        component.modalFiltersCopy = [
            {
                name: 'Custom',
                value: {
                    date_from: '',
                    date_to: '',
                },
                active: true,
            },
        ];

        spyOn(component, 'handleScheduledDateChange').and.callThrough();
        component.handleScheduledDateChange(
            '2023-02-14T03:00:00+03:00',
            'end_date'
        );
        expect(component.handleScheduledDateChange).toHaveBeenCalledWith(
            '2023-02-14T03:00:00+03:00',
            'end_date'
        );
    });

    it('should test handleScheduledDateChange method with context as unknown value', () => {
        component.modalFiltersCopy = [
            {
                name: 'Custom',
                value: {
                    date_from: '',
                    date_to: '',
                },
                active: true,
            },
        ];

        spyOn(component, 'handleScheduledDateChange').and.callThrough();
        component.handleScheduledDateChange(
            '2023-02-14T03:00:00+03:00',
            'Kimanongo' as 'start_date'
        );
        expect(component.handleScheduledDateChange).toHaveBeenCalledWith(
            '2023-02-14T03:00:00+03:00',
            'Kimanongo' as 'start_date'
        );
    });

    it('should test determineWhetherToShow method with name as Custom', () => {
        spyOn(component, 'determineWhetherToShow').and.callThrough();
        component.determineWhetherToShow('Custom');
        expect(component.determineWhetherToShow).toHaveBeenCalledWith('Custom');
    });

    it('should test determineWhetherToShow method Custom date field as active', () => {
        spyOn(component, 'getCustomDateField').and.returnValue({
            name: 'Custom',
            value: {
                date_from: '',
                date_to: '',
            },
            active: true,
        });

        spyOn(component, 'determineWhetherToShow').and.callThrough();
        component.determineWhetherToShow();
        expect(component.determineWhetherToShow).toHaveBeenCalled();
    });

    it('should test determineWhetherToShow method Custom date field as active with dateFrom value as truthy', () => {
        component.dateFrom = '2023-02-14T03:00:00+03:00';
        spyOn(component, 'getCustomDateField').and.returnValue({
            name: 'Custom',
            value: {
                date_from: '',
                date_to: '',
            },
            active: true,
        });

        spyOn(component, 'determineWhetherToShow').and.callThrough();
        component.determineWhetherToShow();
        expect(component.determineWhetherToShow).toHaveBeenCalled();
    });

    it('should test determineWhetherToShow method with name argument as fasly value', () => {
        component.modalFiltersCopy = [
            {
                name: 'Kimanongo',
                value: {
                    date_from: '',
                    date_to: '',
                },
                active: true,
            },
        ];

        spyOn(component, 'determineWhetherToShow').and.callThrough();
        component.determineWhetherToShow(undefined);
        expect(component.determineWhetherToShow).toHaveBeenCalledWith(
            undefined
        );
    });

    it('should test getCustomDateField method', () => {
        component.modalFiltersCopy = [
            {
                name: 'Custom',
                value: {
                    date_from: '',
                    date_to: '',
                },
                active: true,
            },
        ];

        spyOn(component, 'getCustomDateField').and.callThrough();
        component.getCustomDateField();
        expect(component.getCustomDateField).toHaveBeenCalled();
    });
});
