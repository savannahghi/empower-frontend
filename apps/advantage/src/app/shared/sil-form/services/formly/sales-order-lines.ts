import { Injectable } from '@angular/core';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import {
    catchError,
    concat,
    debounceTime,
    distinctUntilChanged,
    map,
    Observable,
    of,
    startWith,
    Subject,
    switchMap,
    tap,
} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DirectSalesOrderLinesService {
    component: any;
    model: any = {};

    products$: Observable<any>;
    productsInput$ = new Subject<string>();
    loading: boolean = false;

    /**
     * Imports datalayer for service calls
     * @param dataLayer gives access to the datalayer service
     */
    constructor(public dataLayer: SilStoresService) {}

    fields() {
        return [
            {
                key: 'product',
                type: 'select',
                className: 'col-12',
                props: {
                    label: 'Product',
                    placeholder: 'Select product',
                    observableItem: true,
                    observable: this.products$,
                    observableInput: this.productsInput$,
                    bindLabel: [
                        { key: 'product_name', newline: true },
                        {
                            key: 'price_inclusive_tax',
                            label: 'Price',
                            newline: true,
                            class: 'fw-semibold',
                        },
                        {
                            key: 'display_quantity',
                            label: 'Remaining Quantity',
                            class: 'text-muted',
                            newline: true,
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                    loading: this.loading,
                    loadingText: 'Loading products...',
                    searchable: false,
                    virtualScroll: true,
                    clearSearchOnAdd: false,
                    closeOnSelect: true,
                },
                expressions: {
                    'model.product': field => {
                        if (field?.model?.product) {
                            return field?.model?.product;
                        }
                    },
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 100,
                    },
                },
            },
            {
                key: 'quantity',
                type: 'input',
                className: 'col-12',
                defaultValue: 1,
                props: {
                    type: 'number',
                    placeholder: 'Enter Quantity',
                    label: 'Quantity',
                    required: true,
                },
                expressions: {
                    'model.quantity': field => {
                        if (field?.model?.quantity) {
                            return field?.model?.quantity;
                        }
                    },
                },
            },
        ];
    }

    setComponent(component) {
        this.component = component;
        this.loadProducts();
    }

    tapFunction = () => (this.loading = true);
    tapLoading = () => (this.loading = false);
    catchErrorFunction = () => of([]);

    switchMapProductFunction = () =>
        this.getProducts().pipe(
            catchError(this.catchErrorFunction),
            tap(this.tapLoading)
        );

    loadProducts() {
        this.products$ = concat(
            of([]),
            this.productsInput$.pipe(
                startWith(''),
                distinctUntilChanged(),
                debounceTime(800),
                tap(this.tapFunction),
                switchMap(this.switchMapProductFunction)
            )
        );
    }

    productsResponseFunction = resp => {
        return resp.results.map(item => {
            let disabled = false;
            let disabledText: string;
            let display_quantity: number | string | null = null;

            if (item.remaining_quantity === 0) {
                disabled = true;
                disabledText = 'No stock to dispense';
                display_quantity = 0;
            } else if (typeof item.remaining_quantity === 'number') {
                display_quantity = item.remaining_quantity;
            } else if (item.remaining_quantity === null) {
                display_quantity = 'Not Tracked';
            }

            const mappedItem = {
                ...item,
                disabled,
                ...(disabledText ? { disabledText } : {}),
                ...(display_quantity !== null ? { display_quantity } : {}),
            };
            return mappedItem;
        });
    };

    getProducts(): Observable<any> {
        return this.dataLayer
            .list('price-list-products')
            .pipe(map(this.productsResponseFunction));
    }
}
