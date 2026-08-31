import { Injectable } from '@angular/core';
import { Authorization } from '../../../@core/auth/services/authorization.service';
import { ErrorHandlerService } from '../../../shared/sil-http-services/error-handler';
import { Subject } from 'rxjs';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';

@Injectable({
    providedIn: 'root',
})
export class ProviderOnboardingService {
    user: Object;
    component: Object;
    refreshEmitter: Subject<any>;

    constructor(
        public dataLayer: SilStoresService,
        public authConfig: Authorization,
        private errorHandler: ErrorHandlerService
    ) {
        this.user = this.authConfig.getUser();
        this.refreshEmitter = new Subject();
    }

    setupComponent(component) {
        this.component = component;
    }

    public returnComponent() {
        return this.component;
    }

    refreshComponent(model) {
        this.refreshEmitter.next(model);
    }

    // setup owner form table
    setupOwnerFormTable(component) {
        component.ownerTableModel['headers'] = [
            { text: 'Name' },
            { text: 'Contact' },
            { text: 'ID / Passport' },
            { text: 'KRA Pin' },
            { text: 'Action' },
        ];
        component.ownerTableModel['title'] = 'Owner';
        component.ownerTableModel['data'] =
            component.providerData['business_owners'];
        component.ownerTableModel['action'] = true;
        component.ownerTableModel['rows'] = [
            {
                keys: ['title', 'full_name'],
                type: 'chain',
                nested: [
                    {
                        label: 'Gender',
                        value: 'gender',
                        type: 'string_rest',
                        required: true,
                    },
                    {
                        label: 'DoB',
                        value: 'dob',
                        type: 'date_rest',
                        required: true,
                    },
                ],
            },
            {
                nested: [
                    {
                        label: 'Email',
                        value: 'email',
                        type: 'string_rest',
                        required: true,
                    },
                    {
                        label: 'Phone',
                        value: 'phone_number',
                        type: 'string_rest',
                        required: true,
                    },
                ],
            },
            {
                nested: [
                    { label: 'ID', value: 'national_id', type: 'string_rest' },
                    {
                        label: 'Passport',
                        value: 'passport_no',
                        type: 'string_rest',
                    },
                    {
                        nolabel: true,
                        value: 'owner_kyc_docs',
                        type: 'document',
                        document: 'NATIONAL ID',
                    },
                    {
                        nolabel: true,
                        value: 'owner_kyc_docs',
                        type: 'document',
                        document: 'PASSPORT',
                    },
                ],
            },
            {
                key: 'kra_pin',
                type: 'string',
                nested: [
                    {
                        nolabel: true,
                        value: 'owner_kyc_docs',
                        type: 'document',
                        document: 'KRA CERTIFICATE',
                        required: true,
                    },
                ],
            },
        ];
        component.ownerTableModel['actions'] = [
            {
                btnText: 'EDIT',
                status: 'success',
                action: 'modal',
                modalConf: {
                    checkExpressionOn: 'modelChange',
                    context: 'VIEW OWNER',
                    service: 'selfBusinessOwnerService',
                    refreshDismiss: true,
                    refreshFxn: 'refreshData',
                    dataObj: 'business_owners',
                },
            },
        ];
        component.ownerTableModel['headerActions'] = [
            {
                btnText: 'ADD EMPTY OWNER RECORD',
                status: 'success',
                action: 'quickPatch',
                modalConf: {
                    method: 'addOwner',
                    context: 'ADD OWNER',
                    service: 'selfBusinessOwnerService',
                    refreshDismiss: true,
                    refreshFxn: 'refreshData',
                    dataObj: 'business_owners',
                },
            },
        ];
    }

    fetchOrganisation(component) {
        // add organisation information
        const organisation = this.authConfig.getErpOrganisation();
        this.dataLayer
            .get('erp-organisations', organisation.organisation_id)
            .subscribe({
                next: (org: any) => {
                    component.providerData['email_address'] = org.email_address;
                    component.providerData['physical_address'] =
                        org.physical_address;
                },
                error: err => {
                    this.errorHandler.handleError(err, this.component);
                },
            });
    }

    // fetch the provider for sil process
    fetchProvider(comp?) {
        const component = comp ? comp : this.component;
        this.dataLayer
            .get('erp-provider', component.providerData.id)
            .subscribe({
                next: (response: any) => {
                    component.providerId = response.id;
                    component.providerData = response;
                    component.providerName = response.name;
                    // augment organisation information
                    this.fetchOrganisation(component);
                },
                error: err => {
                    this.errorHandler.handleError(err, component);
                },
            });
    }

    setupCompleteness(component) {
        component.onboarding = {};
        this.setupComponent(component);
        component.loadingForm = false;
    }
}
