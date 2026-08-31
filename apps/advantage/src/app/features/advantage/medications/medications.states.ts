import { Ng2StateDeclaration } from '@uirouter/angular';
import { ListComponent } from '../../../shared/list/list.component';

/**
 * Contains the medication requests list component
 * The component allows you to view medication requests
 */
export const medicationsState: Ng2StateDeclaration = {
    name: 'app.advantage.medications',
    url: '/medications?search&page&page_size&status',
    breadcrumb: () => 'Medications',
    data: {
        requiresAuth: true,
        hideCreateButton: true,
        tableHeader: [
            { text: 'Medication' },
            { text: 'Dose Unit' },
            { text: 'Dose Quantity' },
            { text: 'Condition' },
            { text: 'Status' },
        ],
        rows: [
            {
                key: 'medication_name',
                type: 'string',
            },
            {
                path: 'dosage.0.dose_unit',
                type: 'mineVal',
            },
            {
                path: 'dosage.0.dose_quantity',
                type: 'mineVal',
            },
            {
                path: 'dosage.0.condition',
                type: 'mineVal',
            },
            {
                key: 'status',
                type: 'statusColor',
            },
        ],
        statusFilters: [
            {
                display: 'All',
                filter: {
                    status: 'clear',
                },
            },
            {
                display: 'Active',
                filter: {
                    status: 'ACTIVE',
                },
            },
            {
                display: 'Completed',
                filter: {
                    status: 'COMPLETED',
                },
            },
        ],
        filterParams: {
            fields: 'id,medication_name,created,status,dosage,patient,queue',
            page_size: '10',
        },
        actions: [],
        pageTitle: 'Medication requests',
        pageSubTitle: 'Easily manage and track your medication requests here',
        hasSearch: true,
        emptyStateTitle: 'No medication requests yet',
        emptyStateMessage:
            'You currently have no medication requests. Once you receive them, they will appear here.',
        emptyStateImage: '../../../../assets/images/empty-medications.svg',
        emptyStateImageStyles: 'height: 8.75rem; width: 8.75rem',
    },
    resolve: [
        {
            token: 'store',
            resolveFn: () => 'prescriptions',
        },
        {
            token: 'storeLabel',
            resolveFn: () => 'Medication Requests',
        },
        {
            token: 'detailList',
            resolveFn: () => false,
        },
    ],
    views: {
        '$default@app.advantage': {
            component: ListComponent,
        },
    },
};
/**
 * Contains all the ui router states in the medications module
 */
export const MEDICATIONS_STATES = [medicationsState];
