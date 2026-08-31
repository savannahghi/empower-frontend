import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { UIRouterGlobals } from '@uirouter/angular';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines add transfer item form controls, methods
 */
export class SetupOrganisationFeatureFormService {
    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;

    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Stores the form model data
     */
    model: Object;

    existingFeatures: any;

    constructor(
        private dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        public uiglobals: UIRouterGlobals
    ) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'feature',
                type: 'select',
                className: 'col-12',
                props: {
                    placeholder: 'Enter Organisation Feature',
                    label: 'Organisation Feature',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        {
                            title: 'Biometrics',
                            value: 'BIOMETRICS',
                        },
                        {
                            title: 'Auto Recon',
                            value: 'RECON',
                        },
                        {
                            title: 'ETIMS',
                            value: 'ETIMS',
                        },
                    ],
                    searchable: false,
                    closeOnSelect: true,
                    required: true,
                    multiple: false,
                },
                hooks: {
                    onInit: () => this.getOrganisationFeatures(),
                },
                validators: {
                    notDuplicate: {
                        expression: control => {
                            const selectedValue = control.value;

                            return !this.existingFeatures
                                ?.map(feature => feature.name)
                                .includes(selectedValue);
                        },
                    },
                },
            },
            {
                type: 'template',
                className: 'col-12 mb-3',
                expressionProperties: {
                    'props.template': model => {
                        const selected = model.feature;
                        const existing =
                            this.existingFeatures?.map(f => f.name) || [];

                        if (selected && existing.includes(selected)) {
                            return `<div class="text-danger">
                              This feature has already been added
                            </div>`;
                        }
                        return '';
                    },
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
    }

    getOrganisationFeatures() {
        const params = {
            organisation: this.uiglobals.params.id,
        };

        this.dataLayer.list('organisation-features', params).subscribe({
            next: (response: any) => {
                this.existingFeatures = response.results;
            },
            error: this.handleErrorFxn,
        });
    }

    handleErrorFxn = (err: any) => {
        this.errorHandler.handleError(err, this);
    };
}
