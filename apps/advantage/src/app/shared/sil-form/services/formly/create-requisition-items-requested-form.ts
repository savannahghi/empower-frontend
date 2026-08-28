import { Injectable } from '@angular/core';
/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the form registration service
 */
export class CreateRequisitionItemsRequestedFieldsService {
    /**
     * Component reference to SilFormComponent
     * @returns fields information
     */
    component: any;

    /**
     * Stores form data from api
     */
    model: any = {};

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'product',
                type: 'combobox',
                className: 'col-12 mb-1',
                props: {
                    label: 'Product',
                    store: 'products',
                    responseKey: 'results',
                    placeholder: 'Select or type to search',
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                        },
                        {
                            key: 'code',
                            label: 'Code',
                            newline: true,
                        },
                        {
                            key: 'selling_price',
                            label: 'Price',
                            type: 'currency',
                        },
                        {
                            key: 'quantity_at_hand',
                            label: 'Remaining Stock',
                            newline: true,
                            class: 'fs-9',
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
            },
            {
                key: 'product_uom',
                type: 'combobox',
                className: 'col-12 mb-1',
                props: {
                    label: 'Unit of Measure',
                    store: 'products-uom',
                    responseKey: 'results',
                    placeholder: 'Select or type to search unit of measure',
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                        },
                        {
                            key: 'category_name',
                            label: 'Category',
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
            },
            {
                key: 'quantity',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Quantity',
                    required: true,
                },
            },
        ];
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}
