/**
 * List of imports used in the injectable
 */
import { Injectable } from '@angular/core';
import kenyanCountiesandSubcounties from './../../../../../assets/data/kenyan-counties-and-subcounties.json';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { startWith, distinctUntilChanged } from 'rxjs';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})
export class OperatingRegionsService {
    /**
     * Stores instance of the form component
     */
    component: any;

    model: Object;

    /**
     * Stores counties
     */
    countiesList: any;
    subCountiesOptions: [];

    constructor() {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'county',
                type: 'select',
                className: 'col-12',
                props: {
                    placeholder: 'Search for County',
                    label: 'Select County',
                    bindLabel: 'county',
                    bindValue: 'county',
                    options: this.countiesList,
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: false,
                    clearSearchOnAdd: false,
                    loadingText: 'Searching County..',
                    typeToSearchText: 'Please enter 3 or more characters',
                    searchable: true,
                    searchWhileComposing: false,
                    hideSelected: true,
                    required: true,
                    virtualScroll: true,
                    isSubCounties: true,
                },
                hooks: {
                    onChanges: field => this.updateSubCounties(field),
                },
            },
            {
                key: 'sub_county',
                type: 'select',
                className: 'col-12',
                props: {
                    placeholder: 'Search for Sub-County',
                    options: [],
                    label: 'Select Sub-County',
                    bindLabel: 'name',
                    bindValue: 'value',
                    required: true,
                    closeOnSelect: true,
                    searchable: true,
                    customOptions: this.subCountiesOptions,
                },
                expressions: {
                    'props.disable': (field: FormlyFieldConfig) =>
                        !field.model?.county,
                },
            },
        ];
    }

    /**
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
        this.formatCountiesList();
    }

    formatCountiesList() {
        this.countiesList = kenyanCountiesandSubcounties.map(counties => {
            return {
                county: counties.name,
                subCounty: counties.sub_counties,
            };
        });
    }

    getSubCounties(subC) {
        const subCounties = this.countiesList.find(
            county => county.county === subC
        );
        this.subCountiesOptions = subCounties?.subCounty.map(subCounty => ({
            name: subCounty,
            value: subCounty,
        }));

        return this.subCountiesOptions;
    }

    updateSubCounties(field) {
        const countyControl = field?.parent?.get('county').formControl;

        countyControl?.valueChanges
            .pipe(startWith(countyControl.value), distinctUntilChanged())
            .subscribe(selectedCounty => {
                if (!selectedCounty) {
                    const subCountyControl =
                        field.parent.get('sub_county').formControl;
                    /**
                     * Clears the sub county value if the county value is not passed
                     */
                    subCountyControl.setValue(null);
                    return;
                }
                const options = this.getSubCounties(selectedCounty);
                const control = field.parent.get('sub_county');
                control.props.options = options;

                this.subCountiesOptions = options;
                this.component.cd.detectChanges();
            });
    }
}
