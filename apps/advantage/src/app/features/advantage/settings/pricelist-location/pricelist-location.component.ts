import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { UIRouterGlobals } from '@uirouter/angular';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';

@Component({
    selector: 'ngx-pricelist-location',
    templateUrl: './pricelist-location.component.html',
    styleUrls: ['./pricelist-location.component.scss'],
    standalone: false,
})
export class PricelistLocationComponent implements OnInit {
    /**
     * Toggles for modals
     */
    toggle: { [key: string]: boolean } = {};

    /**
     * Locations associated with the pricelist
     */
    locations: any[] = [];

    /**
     * Rows configuration for the table
     */
    rows: Array<any> = [{ key: 'name', type: 'string' }];

    /**
     * Table header configuration
     */
    tableHeader = [
        { text: 'Location Name', key: 'name' },
        { text: 'Action', key: 'action' },
    ];

    /**
     * Actions available for each row in the table
     */
    actions = [];

    /**
     * Pricelist ID to fetch locations for
     */
    @Input() pricelistId: string;

    /**
     * Event emitter to notify when locations are changed
     */
    @Output() locationsChanged = new EventEmitter<void>();

    constructor(
        private dataLayer: SilStoresService,
        private toastrService: NbToastrService,
        private uiglobals: UIRouterGlobals,
        private errorHandler: ErrorHandlerService
    ) {}

    ngOnInit() {
        this.pricelistId = this.pricelistId || this.uiglobals.params.id;
        this.actions = [
            {
                btnText: 'Delete',
                status: 'danger',
                action: 'quickPatch',
                confirm: {
                    title: 'Confirm Delete',
                    text: 'Are you sure you want to remove this location?',
                    showCancelButton: true,
                    cancelButtonColor: '#edf1f7',
                    confirmButtonText: 'Remove',
                },
                modalConf: {
                    view: 'remove_location',
                    method: 'removePricelistLocation',
                    pricelistId: this.pricelistId,
                },
            },
        ];
        this.loadLocations();
    }

    loadLocations() {
        if (this.pricelistId) {
            this.dataLayer.get('pricelists', this.pricelistId).subscribe({
                next: (pricelist: any) => {
                    const locationIds = pricelist.locations || [];
                    if (locationIds.length === 0) {
                        this.locations = [];
                        return;
                    }
                    Promise.all(
                        locationIds.map((id: string) =>
                            this.dataLayer.get('org-units', id).toPromise()
                        )
                    )
                        .then((locationObjs: any[]) => {
                            this.locations = locationObjs;
                        })
                        .catch(e => {
                            this.errorHandler.handleError(e);
                            this.locations = [];
                        });
                },
                error: () => {
                    this.showToast(
                        'bottom-right',
                        'danger',
                        'Error',
                        'Failed to load locations.'
                    );
                },
            });
        }
    }

    addLocation() {
        this.toggle['addLocation'] = true;
    }

    saveLocation(model: any) {
        if (!model?.location) return;

        const locationIds = [
            ...this.locations.map(loc => loc.id),
            model.location,
        ];
        const payload = { locations: locationIds };
        this.dataLayer
            .update('pricelists', this.pricelistId, payload)
            .subscribe({
                next: () => {
                    this.showToast(
                        'bottom-right',
                        'success',
                        'Success',
                        'Location added successfully!'
                    );
                    this.toggle['addLocation'] = false;
                    this.loadLocations();
                    this.locationsChanged.emit();
                },
                error: () => {
                    this.showToast(
                        'bottom-right',
                        'danger',
                        'Error',
                        'Failed to add location.'
                    );
                },
            });
    }

    toggleModal(context: string) {
        this.toggle[context] = !this.toggle[context];
    }

    showToast(position: any, status: string, title: string, msg: string) {
        const duration = 7000;
        this.toastrService.show(msg, title, { position, status, duration });
    }
}
