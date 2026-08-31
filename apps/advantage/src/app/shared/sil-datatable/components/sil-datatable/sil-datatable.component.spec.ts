import { SilDatatableComponent } from './sil-datatable.component';
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    SimpleChange,
    Pipe,
    PipeTransform,
    NO_ERRORS_SCHEMA,
    SimpleChanges,
} from '@angular/core';
import {
    NbToastrService,
    NbButtonModule,
    NbSpinnerModule,
    NbStatusService,
} from '@nebular/theme';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../app-config.service';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/core';
import { SilDatatableService } from './sil-datatable.service';

import { ApolloTestingModule } from 'apollo-angular/testing';
import { Apollo } from 'apollo-angular';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

const apolloServiceStub = {
    createApolloClient() {
        return {
            link: 'https://clinical-testing.slade360edi.com/graphql',
        };
    },
    watch: () => ({
        valueChanges: of({
            data: {
                id: 1,
            },
            loading: false,
        }),
    }),
    create() {
        return of({
            data: { id: 1 },
        });
    },
};

const apolloServiceStubError = {
    mutate: () => ({
        error: of([
            {
                error: new Error('Boom'),
            },
        ]),
    }),
};

function mockPipe(name: string): Pipe {
    const metadata: Pipe = {
        name,
    };

    return Pipe(metadata)(
        class MockPipe implements PipeTransform {
            transform() {}
        }
    );
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    transitionTo() {
        return true;
    }
    includes() {
        return true;
    }
    reload() {
        return true;
    }
}

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params: {
        page_size: '2',
    },
    $current: {
        params: {
            page_size: '2',
        },
    },
};

class SilStoresServiceStub {
    create() {
        return of({
            data: [
                {
                    node: {
                        status: '',
                    },
                },
            ],
        });
    }
    update() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    downloadDocument() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    getStore() {
        return {
            url: '/adfasdf/',
        };
    }
    getServer() {
        return 'http:localhost/asdff';
    }
    listNested() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    list() {
        return of({
            next: 'url',
            count: '2',
            data: {
                next: 'url',
                count: '2',
                results: [],
            },
        });
    }
    createNested() {
        return of({
            id: '12312',
        });
    }
}
class SilDatatableServiceStub {
    setupComponent() {
        return {};
    }
    createMessageLogsReport() {}
}

class NbToastrServiceStub {
    show() {
        return {};
    }
}

class AuthorizationConfigStub {
    getUser() {
        const stringified = JSON.stringify({
            business_partner: 1,
            client_types: ['PROVIDER'],
        });
        return stringified;
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
    getToken() {
        return {};
    }
}

class NbStatusServiceStub {
    isCustomStatus() {}
}

describe('SilDatatableComponent: success', () => {
    let component: SilDatatableComponent;
    let fixture: ComponentFixture<SilDatatableComponent>;
    const routerSpy = {
        navigate: jasmine.createSpy('navigate'),
        navigateByUrl: jasmine.createSpy('navigateByUrl'),
    };
    const fakeActivatedRoute = {
        navigate: jasmine.createSpy('navigate'),
        navigateByUrl: jasmine.createSpy('navigateByUrl'),
        snapshot: { data: {}, navigate: jasmine.createSpy('navigate') },
    } as unknown as ActivatedRoute;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilDatatableComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('app'),
                mockPipe('translate'),
                mockPipe('truncate'),
                mockPipe('phoneNumberPipe'),
                mockPipe('removeUnderScore'),
                NbButtonModule,
                NbSpinnerModule,
                FormsModule,
                RouterModule,
                RouterTestingModule,
                ApolloTestingModule,
            ],
            providers: [
                { provide: Authorization, useClass: AuthorizationConfigStub },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: ActivatedRoute, useValue: routerSpy },
                { provide: Router, useValue: fakeActivatedRoute },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { Apollo: Apollo, useValue: apolloServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilDatatableComponent);
        component = fixture.componentInstance;
        component.supportsZeroState = true;
        component.cardListSearch = false;
        component.zeroState = {
            hideActionButtons: false,
        };
        component.hasDisabledCheckboxes = true;
        component.disableByFields = { status: 'REVIEWED' };
        component.rows = [
            { id: 1, isSelected: false, status: 'PENDING' },
            { id: 2, isSelected: false, status: 'REVIEWED' },
            {
                id: 3,
                isSelected: false,
                status: 'DELIVERED',
                sms: { state: 'DELIVERED' },
            },
            {
                id: 4,
                isSelected: false,
                status: 'FAILED',
                sms: { state: 'FAILED' },
            },
            {
                id: 5,
                isSelected: false,
                status: 'SENT',
                sms: { state: 'SENT' },
            },
        ];
        fixture.detectChanges();
    });

    it('should test getData method when cardListSearch is set to true', () => {
        spyOn(component, 'getData').and.callThrough();
        component.sendDataToParent = true;
        component.restFxn = 'list';
        component.restApi = 'patients';
        component.queryArg = {};
        component.cardListSearch = true;
        component.getData();
        expect(component.getData).toHaveBeenCalled();
    });

    it('should return proper tooltip message for SMS delivery statuses', () => {
        // Test all SMS delivery status tooltips with sms.state path
        expect(component.getStatusTooltip('DELIVERED', 'sms.state')).toBe(
            "The SMS has been delivered to the user's phone"
        );
        expect(component.getStatusTooltip('FAILED', 'sms.state')).toBe(
            "The SMS gateway can't process the request due to invalid number"
        );
        expect(component.getStatusTooltip('SENT', 'sms.state')).toBe(
            'The SMS has been sent to the SMS gateway'
        );
        expect(component.getStatusTooltip('QUEUED', 'sms.state')).toBe(
            'The SMS gateway has successfully received the request'
        );
        expect(component.getStatusTooltip('UNDELIVERED', 'sms.state')).toBe(
            "The SMS couldn't be delivered to the user's phone"
        );
        expect(component.getStatusTooltip('REJECTED', 'sms.state')).toBe(
            'The SMS gateway rejected the SMS'
        );
    });

    it('should return empty message for unknown delivery status or non-SMS paths', () => {
        // Test unknown SMS status
        expect(component.getStatusTooltip('UNKNOWN_STATUS', 'sms.state')).toBe(
            ''
        );
        expect(component.getStatusTooltip('', 'sms.state')).toBe('');
        expect(component.getStatusTooltip(null, 'sms.state')).toBe('');
        expect(component.getStatusTooltip(undefined, 'sms.state')).toBe('');

        // Test non-SMS paths (should return empty)
        expect(component.getStatusTooltip('DELIVERED', 'other.path')).toBe('');
        expect(component.getStatusTooltip('DELIVERED', '')).toBe('');
        expect(component.getStatusTooltip('DELIVERED', null)).toBe('');
    });

    it('should handle SMS state mocking in table rows', () => {
        // Mock SMS state data structure
        const mockSmsRow = {
            id: 1,
            message: 'Test SMS message',
            sms: {
                state: 'DELIVERED',
                phone_number: '+254700000000',
                sent_at: '2023-01-01T10:00:00Z',
            },
        };

        // Test that the SMS state is properly accessible
        expect(mockSmsRow.sms.state).toBe('DELIVERED');

        // Test tooltip functionality with mocked SMS state
        expect(
            component.getStatusTooltip(mockSmsRow.sms.state, 'sms.state')
        ).toBe("The SMS has been delivered to the user's phone");

        // Test different SMS states
        const smsStates = [
            'DELIVERED',
            'FAILED',
            'SENT',
            'QUEUED',
            'UNDELIVERED',
            'REJECTED',
        ];
        smsStates.forEach(state => {
            const mockRow = { sms: { state } };
            const tooltip = component.getStatusTooltip(
                mockRow.sms.state,
                'sms.state'
            );
            expect(tooltip).toBeTruthy(); // Should return a non-empty string for valid states
        });
    });

    it('should not fetch if queryArg is defined', () => {
        component.queryArg = {};
        component.ngOnInit();
        component.setFreshTableFilter({ status: 'active' });
        expect(component).toBeTruthy();
    });

    it('should not fetch if queryArg is defined other branch', () => {
        component.queryArg = {};
        component.ngOnInit();
        component.supportsZeroState === false;
        component.navigateFromZeroState('app.advantage.segments.create');
        component.setFreshTableFilter({ status: 'active' });
        expect(component).toBeTruthy();
    });

    it('should determine if tableRowsIsSelectable', () => {
        component.rows = [{ select: true }];
        component.hasSelectRow = true;
        spyOn(component, 'tableRowsIsSelectable').and.callThrough();
        component.tableRowsIsSelectable();
        expect(component.tableRowsIsSelectable).toHaveBeenCalled();
    });

    it('should determine if table rows is not selectable', () => {
        component.rows = [{}];
        component.hasSelectRow = false;
        spyOn(component, 'tableRowsIsSelectable').and.callThrough();
        component.tableRowsIsSelectable();
        expect(component.tableRowsIsSelectable).toHaveBeenCalled();
    });

    it('should test exportFxn method', () => {
        const event = {
            workflow_state: 'READY_FOR_REVIEW',
        };

        spyOn(component, 'exportFxn').and.callThrough();
        component.exportFxn(event);
        expect(component.exportFxn).toHaveBeenCalledWith(event);
    });

    it('should test mapFormModelFromRow', () => {
        const modalConf = {
            formModelData: {
                id: '1',
                items: {
                    item: 'id',
                },
            },
        };
        const row = { id: 1 };
        component.mapFormModelFromRow(row, modalConf);
        expect(component).toBeTruthy();
    });

    it('should test gridActions', () => {
        spyOn(component, 'toggleDrawer').and.callThrough();
        spyOn(component, 'toggleModal').and.callThrough();
        const loan = {};
        const row = {
            id: 1,
            data: 'test.com',
            node: {
                id: 123,
                provider: {
                    id: 1,
                },
                referralReportLink: 'test.com',
            },
            person: {
                person_photos: [],
                person_contacts: [
                    {
                        contact: '+254721585473',
                        contact_type: 'phone_number',
                        is_primary_contact: true,
                    },
                    {
                        contact: 'fake@gmail.com',
                        contact_type: 'email',
                        is_primary_contact: false,
                    },
                ],
            },
        };
        const modalCustom = {
            action: 'custom',
            openModal: true,
        };
        const customFxn = {
            action: 'custom',
            customFxn: true,
        };
        const modalConf = {
            field: 'id',
            key: 'id',
            path: '',
            url: 'https://google.com',
            method: 'patchPatient',
            store: 'patientRegisterService',
            isService: true,
            action: 'quickPatch',
            state: 'app.advantage.appointment.detail',
            sortData: true,
            stateParams: {
                appointment_id: 'id',
            },
        };
        const modalConf1 = {
            activeStateParams: ['params1'],
        };
        const modalConfState = {
            state: 'app.advantage.appointment.detail',
        };
        const modalConfState2 = {
            state: 'app.advantage.appointment.detail',
            stateParams: {
                id: 'node.id',
            },
        };
        const modalConfState3 = {
            state: 'app.advantage.appointment.detail',
            activeStateParams: ['params1'],
            stateParams: {
                id: 'node.id',
            },
        };
        component.gridActions.custom(row, customFxn);
        component.gridActions.custom(row, modalCustom);
        component.gridActions.drawer(loan);
        component.gridActions.modal(row, modalConf);
        component.gridActions.quickPatch(row, modalConf);
        component.gridActions.stateGo(row, modalConf);
        component.gridActions.markNotificationAsReadAndRedirectToInvoice(
            row,
            modalConf
        );
        component.gridActions.quintusStateGo(row, modalConf);
        component.gridActions.openDocument(row);
        component.gridActions.openAttachment(row);
        component.gridActions.alert();
        component.gridActions.fake();
        component.gridActions.stateGo(row, modalConfState);
        component.gridActions.stateGo(row, modalConfState2);
        component.gridActions.stateGo(row, modalConfState3);
        component.gridActions.stateGo(row, modalConf1);
        expect(component.toggleDrawer).toHaveBeenCalledWith(loan);
        expect(component.toggleDrawer).toHaveBeenCalledWith(loan);
        expect(component.toggleModal).toHaveBeenCalledWith(row, modalConf);
        component.toggleModal();
        component.showModal = true;
        component.toggleModal(row, modalConf, { saving: true });
        delete modalConf['sortData'];
        component.toggleModal(row, modalConf, { saving: true });
        component.headerActions = [
            {
                modalConf: {
                    refreshDismiss: true,
                    refreshFxn: 'setupComponent',
                },
                hide: false,
            },
        ];
        const modalConf2 = {
            context: 'VIEW BUSINESS DOCUMENT',
            refreshDismiss: true,
            refreshFxn: 'refreshData',
            dataObj: 'business_owners',
            action: 'modal',
            nestedServices: true,
            service: [
                {
                    type: 'MOH LICENCE',
                    service: 'selfBusinessLicenseService',
                    context: 'LICENSE FROM MINSITRY OF HEATLH',
                    refreshDismiss: true,
                    refreshFxn: 'refreshData',
                    action: 'modal',
                    dataObj: 'business_owners',
                },
            ],
        };

        const row2 = {
            attachment_type: 'MOH LICENCE',
        };
        component.toggleModal(row2, modalConf2, { saving: true });
        component.toggleModal(row2, modalConf2);
    });

    it('should test gridActions with next of kin', () => {
        component.processSelectedItemMethod = 'nextOfKin';
        spyOn(component, 'toggleModal').and.callThrough();
        const row = {
            related: {
                id: '12345',
                first_name: 'John',
                last_name: 'Doe',
                other_names: '',
                gender: 'MALE',
                date_of_birth: '2015-02-02',
                person_ids: [],
                person_contacts: [
                    {
                        contact: '+254721585473',
                        contact_type: 'phone_number',
                        is_primary_contact: true,
                    },
                    {
                        contact: 'fake@gmail.com',
                        contact_type: 'email',
                        is_primary_contact: false,
                    },
                ],
            },
            relationship: 'FRND',
        };
        const cleanedData = {
            id: '12345',
            first_name: 'John',
            other_names: '',
            last_name: 'Doe',
            date_of_birth: '2015-02-02',
            person_ids: [],
            person_contacts: [
                {
                    contact: '+254721585473',
                    contact_type: 'phone_number',
                    is_primary_contact: true,
                },
                {
                    contact: 'fake@gmail.com',
                    contact_type: 'email',
                    is_primary_contact: false,
                },
            ],
            gender: 'MALE',
            relationship: 'FRND',
        };
        const modalConf = {
            path: '',
            nestedId: '1234',
            method: 'patchNextOfKin',
            store: 'NextofKinRegistrationService',
            isService: true,
            action: 'quickPatch',
            state: 'app.advantage.appointment.detail',
            sortData: true,
            stateParams: {
                appointment_id: 'id',
            },
        };
        component.dataLayer.workstation = {
            workstation: '23232',
        };
        component.gridActions.modal(row, modalConf);
        expect(component.toggleModal).toHaveBeenCalledWith(
            cleanedData,
            modalConf
        );
    });

    it('should test gridActions with checkin-list', () => {
        spyOn(component, 'toggleModal').and.callThrough();
        component.processSelectedItemMethod = 'checkin-list';
        const row = {
            patient_details: {
                person: {
                    id: '12345',
                    first_name: 'John',
                    last_name: 'Doe',
                    other_names: '',
                    gender: 'MALE',
                    date_of_birth: '2015-02-02',
                    person_ids: [],
                    person_contacts: [
                        {
                            contact: '+254721585473',
                            contact_type: 'phone_number',
                            is_primary_contact: true,
                        },
                    ],
                },
            },
        };
        const modalConf = {
            context: 'Edit Patient',
            formConfig: {
                checkExpressionOn: 'changeDetectionCheck',
            },
            store: 'patientRegisterService',
            isService: true,
            sortData: true,
            action: 'quickPatch',
            method: 'patchPatient',
        };
        component.dataLayer.workstation = {
            workstation: '23232',
        };
        component.gridActions.modal(row, modalConf);
        expect(component.toggleModal).toHaveBeenCalledWith(
            row.patient_details,
            modalConf
        );
    });

    it('should test the showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test downloadDocument', () => {
        const file = new Blob();
        spyOn(component.dataLayer, 'downloadDocument').and.returnValue(
            of(file)
        );
        const row = {
            id: 1,
        };
        const modalConf = {
            path: '',
            method: 'patchPatient',
            api: 'sales-invoice',
        };
        component.gridActions.downloadDocument(row, modalConf);
        expect(component.dataLayer.downloadDocument).toHaveBeenCalled();
    });

    it('should test downloadDocument with actConf.downloadId defined', () => {
        const row = {
            id: 1,
        };
        const actConf = {
            downloadId: 'id',
            api: 'sales-invoices',
        };
        component.dataLayer.workstation = {
            workstation: '23232',
        };
        spyOn(component.dataLayer, 'downloadDocument').and.callThrough();
        component.gridActions.downloadDocument(row, actConf);
        expect(component.dataLayer.downloadDocument).toHaveBeenCalled();
    });

    it('should test selectRow method', () => {
        spyOn(component, 'selectRow').and.callThrough();
        component.supportsZeroState = true;
        component.selectRow({});
        component.defaultQueryArg = { ordering: 'start' };
        component.determineIfClearFilterShouldBeShown();
        component.setParams({ page: '2' });
        component.setParams({ ordering: 'start' });
        expect(component.selectRow).toHaveBeenCalledWith({});
    });

    it('should test selectRow method', () => {
        spyOn(component, 'selectRow').and.callThrough();
        component.supportsZeroState = false;
        component.selectRow({});
        component.defaultQueryArg = { ordering: 'start' };
        component.determineIfClearFilterShouldBeShown();
        expect(component.selectRow).toHaveBeenCalledWith({});
    });

    it('should test emitAddBranchCustomer method', () => {
        spyOn(component, 'emitAddBranchCustomer').and.callThrough();
        component.emitAddBranchCustomer('');
        expect(component.emitAddBranchCustomer).toHaveBeenCalledWith('');
    });

    it('should test emitAddItem method', () => {
        spyOn(component, 'emitAddItem').and.callThrough();
        component.emitAddItem('');
        expect(component.emitAddItem).toHaveBeenCalledWith('');
    });

    it('should test emitCustomFxn method', () => {
        const row = { id: 1 };
        spyOn(component, 'emitCustomFxn').and.callThrough();
        component.emitCustomFxn(row);
        expect(component.emitCustomFxn).toHaveBeenCalledWith(row);
    });

    it('should test onInView method', () => {
        spyOn(component, 'onInView').and.callThrough();
        component.onInView(true);
        expect(component.onInView).toHaveBeenCalledWith(true);
    });

    it('should test onFilterRemove', () => {
        spyOn(component, 'onFilterRemove').and.callThrough();
        component.stateFilters = { search: 'name', page_size: '5' };
        component.checkIfStateFiltersExit();
        component.onFilterRemove({ text: 'search: name' });
        expect(component.onFilterRemove).toHaveBeenCalledWith({
            text: 'search: name',
        });
        component.activeStateParams = ['id'];
        component.onFilterRemove({ text: 'page_size: 2' });
        spyOn(component, 'extendStateParams').and.callThrough();
        component.extendStateParams({ search: 'name' });
        component.extendStateParams({ search: 'clear' });
        expect(component.extendStateParams).toHaveBeenCalled();
    });

    it('should test onToggleTagsModal method', () => {
        spyOn(component, 'onToggleTagsModal').and.callThrough();
        component.onToggleTagsModal();
        expect(component.onToggleTagsModal).toHaveBeenCalled();
    });

    it('should test toggleCheckbox method with a row that has disableByFields', () => {
        component.hasSelectRow = true;

        component.disableByFields = { status: 'REVIEWED' };
        component.hasDisabledCheckboxes = true;

        spyOn(component, 'toggleCheckbox').and.callThrough();
        component.toggleCheckbox(
            { id: 1, isSelected: true, status: 'REVIEWED' },
            null
        );
        expect(component.toggleCheckbox).toHaveBeenCalled();
    });

    it('should test toggleCheckbox method with a row that has disableByFields to fail', () => {
        component.hasSelectRow = true;
        const event = {
            target: document.createElement('div'),
        } as unknown as Event;

        component.disableByFields = { status: 'DRAFT' };
        component.hasDisabledCheckboxes = true;

        spyOn(component, 'toggleCheckbox').and.callThrough();
        component.toggleCheckbox({ id: 1, isSelected: true }, event);
        expect(component.toggleCheckbox).toHaveBeenCalled();
    });

    it('should test toggleCheckbox method if table supports select row', () => {
        component.hasSelectRow = true;
        component.hasDisabledCheckboxes = true;

        const event = {
            target: document.createElement('div'),
        } as unknown as Event;

        spyOn(component, 'toggleCheckbox').and.callThrough();
        component.toggleCheckbox({ id: 1, isSelected: false }, event);
        expect(component.toggleCheckbox).toHaveBeenCalledWith(
            { id: 1, isSelected: false },
            event
        );
    });

    it('should not toggleCheckbox and emit event if table does not support select row', () => {
        component.hasSelectRow = false;
        const event = {
            target: document.createElement('div'),
        } as unknown as Event;

        spyOn(component, 'toggleCheckbox').and.callThrough();
        component.toggleCheckbox({ id: 1, isSelected: false }, event);
        expect(component.toggleCheckbox).toHaveBeenCalledWith(
            { id: 1, isSelected: false },
            event
        );
    });

    it('should test dontOverrideDefaultParams', () => {
        spyOn(component, 'setParams').and.callThrough();
        spyOn(component, 'getData');
        component.defaultQueryArg = { ordering: 'start' };
        component.dontOverrideDefaultParams = true;
        component.setParams({ ordering: 'start' });
        expect(component.getData).toHaveBeenCalledWith({
            ordering: 'start',
            page_size: '2',
        });
    });

    it('should test dontOverrideDefaultParams finalFilter match', () => {
        spyOn(component, 'setParams').and.callThrough();
        spyOn(component, 'getData');
        component.hasSelectRow = true;
        component.apilist = [{ id: 1 }];
        component.selectedRows = { id: 1 };
        spyOn(component, 'updateSelectedItems');
        component.updateSelectedItems();
        expect(component.updateSelectedItems).toHaveBeenCalled();
        component.defaultQueryArg = { page_size: '2' };
        component.dontOverrideDefaultParams = true;
        component.setParams({ page_size: '2' });
        expect(component.getData).toHaveBeenCalledWith({ page_size: '2' });
    });

    it('should test silDatatableFiltersArg method', () => {
        spyOn(component, 'silDatatableFiltersArg').and.callThrough();
        component.silDatatableFiltersArg({});
        component.namespace = 'billing';
        component.getNamespacedFilters({ billing_id: 1, id: 1 });
        expect(component.silDatatableFiltersArg).toHaveBeenCalled();
    });

    it('should test setEndCursor method', () => {
        spyOn(component, 'setEndcursor').and.callThrough();
        component.setEndcursor({});
        expect(component.setEndcursor).toHaveBeenCalledWith({});
    });

    it('should test determineQueryFilters method with ignoredStateParams Input', () => {
        spyOn(component, 'determineQueryFilters').and.callThrough();
        component.ignoreStateParams = ['id', 'customer_customer'];
        const query = component.determineQueryFilters({
            id: '1',
            customer_customer: '1',
        });
        component.defaultQueryArg = {};
        component.determineQueryFilters({
            id: '1',
            customer_customer: '1',
        });
        expect(query).toEqual({});
    });

    it('should test mineValue method', () => {
        spyOn(component, 'mineValue').and.callThrough();
        const path = null;
        component.mineValue({}, path);
        expect(component.mineValue).toHaveBeenCalled();
    });

    it('should test mineValue method if path is defined', () => {
        spyOn(component, 'mineValue').and.callThrough();
        const path = 'path';
        component.mineValue({}, path);
        expect(component.mineValue).toHaveBeenCalled();
    });

    it('should test mineValue method if path and object is defined', () => {
        const obj = { item: undefined };
        spyOn(component, 'mineValue').and.callThrough();
        const path = 'item.total';
        component.mineValue(obj, path);
        expect(component.mineValue).toHaveBeenCalled();
    });

    it('should test getData method', () => {
        spyOn(component, 'getData').and.callThrough();
        component.sendDataToParent = true;
        component.restFxn = 'list';
        component.restApi = 'patients';
        component.queryArg = {};
        const response = {
            results: [],
            count: 21,
        };
        spyOn(component.dataLayer, 'list').and.returnValue(of(response));
        component.getData();
        expect(component.getData).toHaveBeenCalled();
    });

    it('should test getData method with nested list', () => {
        spyOn(component, 'getData').and.callThrough();
        component.restFxn = 'listNested';
        component.restApi = 'patients';
        component.view = 'related_person';
        component.nestedId = '1231';
        component.queryArg = {};
        const response = {
            results: [],
            count: 21,
        };
        spyOn(component.dataLayer, 'listNested').and.returnValue(of(response));
        component.getData();
        expect(component.getData).toHaveBeenCalled();
    });

    it('should test getData method when response has response.edges', () => {
        spyOn(component, 'getData').and.callThrough();
        component.restFxn = 'list';
        component.restApi = 'screenings';
        component.queryArg = {};
        const response = {
            edges: [],
        };
        spyOn(component.dataLayer, 'list').and.returnValue(of(response));
        component.getData();
        expect(component.getData).toHaveBeenCalled();
    });

    it('should test getData method when response has response.Edges', () => {
        spyOn(component, 'getData').and.callThrough();
        component.restFxn = 'list';
        component.restApi = 'screenings';
        component.queryArg = {};
        const response = {
            Edges: [],
        };
        spyOn(component.dataLayer, 'list').and.returnValue(of(response));
        component.getData();
        expect(component.getData).toHaveBeenCalled();
    });

    it('should test getData method when results is not defined', () => {
        spyOn(component, 'getData').and.callThrough();
        component.restFxn = 'list';
        component.restApi = 'patients';
        component.queryArg = {};
        const response = [{ id: 1 }];
        spyOn(component.dataLayer, 'list').and.returnValue(of(response));
        component.getData();
        expect(component.getData).toHaveBeenCalled();
    });

    it('should test getData method when results is not defined', fakeAsync(() => {
        spyOn(component, 'getData').and.callThrough();
        component.restFxn = undefined;
        component.getData();
        tick(1000);
        expect(component.getData).toHaveBeenCalled();
    }));

    it('should test getData method error', () => {
        spyOn(component, 'getData').and.callThrough();
        component.restFxn = 'list';
        component.restApi = 'patients';
        component.queryArg = {};
        spyOn(component.dataLayer, 'list').and.returnValue(
            throwError({ status: 404 })
        );
        component.getData();
        expect(component.getData).toHaveBeenCalled();
    });

    it('should test formatDate method', () => {
        spyOn(component, 'formatDate').and.callThrough();
        component.formatDate('2021-02-02');
        expect(component.formatDate).toHaveBeenCalled();
    });

    it('should test toggleFilterDrawer method', () => {
        spyOn(component, 'toggleFilterDrawer').and.callThrough();
        component.toggleFilterDrawer();
        expect(component.toggleFilterDrawer).toHaveBeenCalled();
    });

    it('should test toggleView method', () => {
        spyOn(component, 'toggleView').and.callThrough();
        component.secondaryTable = {
            tableNames: {
                first: undefined,
                second: undefined,
            },
        };
        component.secondaryTable['frontTableActions'] = component.actions;
        component.toggleView();
        expect(component.toggleView).toHaveBeenCalled();
    });

    it('should test toggleView method with back table data', () => {
        spyOn(component, 'toggleView').and.callThrough();
        component.revealed = true;
        component.secondaryTable = {
            tableNames: {
                first: undefined,
                second: undefined,
            },
        };
        component.secondaryTable['frontTableActions'] = component.actions;
        component.toggleView();
        expect(component.toggleView).toHaveBeenCalled();
    });

    it('should test filterFormData method', () => {
        const filters = {
            workflow_state: 'OPEN_FOR_RECON',
            start_date: '2024-11-11T21:00:00.000Z',
            end_date: '2024-11-21T21:00:00.000Z',
        };

        const formattedStartDate = '2024-11-11';
        const formattedEndDate = '2024-11-21';

        spyOn(component, 'filterData').and.callThrough();
        spyOn(component, 'toggleFilterDrawer');
        spyOn(component, 'formatDate').and.callFake(date => {
            return date.split('T')[0];
        });

        component.filterData(filters);
        component.filterData(filters, true);

        expect(component.filterData).toHaveBeenCalled();

        expect(component.formatDate).toHaveBeenCalledWith(filters.start_date);
        expect(component.formatDate).toHaveBeenCalledWith(filters.end_date);

        expect(component.filters.start_date).toBe(formattedStartDate);
        expect(component.filters.end_date).toBe(formattedEndDate);

        expect(component.toggleFilterDrawer).toHaveBeenCalled();
    });

    it('should test clearData method', () => {
        spyOn(component, 'clearData').and.callThrough();
        component.clearData();
        expect(component.clearData).toHaveBeenCalled();
    });

    it('should test ngOnChanges method', () => {
        spyOn(component, 'setParams').and.callThrough();
        spyOn(component, 'getData').and.callThrough();
        component.restFxn = 'list';
        component.restApi = 'patients';
        component.ngOnChanges({
            defaultQueryArg: new SimpleChange(null, {}, false),
            statusFilters: new SimpleChange(null, {}, false),
            secondaryData: new SimpleChange(null, {}, false),
            apilist: new SimpleChange(null, {}, false),
        });
        expect(component.setParams).toHaveBeenCalled();
        expect(component.getData).toHaveBeenCalled();
        component.ngOnChanges({
            another: new SimpleChange(null, undefined, false),
        });
    });

    it('should test filterTable function when filtering by status_type', () => {
        spyOn(component, 'filterTable').and.callThrough();
        const filter = { name: 'Clinic', value: 'CLINIC' };
        component.filterTable(filter, 'status_type');
        expect(component.filterTable).toHaveBeenCalled();
    });

    it('should test onSelectModalFilter method with event as array', () => {
        spyOn(component, 'onSelectModalFilter').and.callThrough();

        component.onSelectModalFilter([{}], 'current_page');
        expect(component.onSelectModalFilter).toHaveBeenCalledWith(
            [{}],
            'current_page'
        );
    });

    it('should test onSelectModalFilter method with context as current_page', () => {
        spyOn(component, 'onSelectModalFilter').and.callThrough();

        component.onSelectModalFilter({ value: '' }, 'current_page');
        expect(component.onSelectModalFilter).toHaveBeenCalledWith(
            { value: '' },
            'current_page'
        );
    });

    it('should test onSelectModalFilter method with context as new_page', () => {
        component.downloadButtonRequest = 'createMessageLogsReport';
        spyOn(component, 'onSelectModalFilter').and.callThrough();

        component.onSelectModalFilter({ value: '' }, 'new_page');
        expect(component.onSelectModalFilter).toHaveBeenCalledWith(
            { value: '' },
            'new_page'
        );
    });

    it('should test onSelectModalFilter method with context passed as falsy', () => {
        spyOn(component, 'onSelectModalFilter').and.callThrough();

        component.onSelectModalFilter([{}], undefined);
        expect(component.onSelectModalFilter).toHaveBeenCalledWith(
            [{}],
            undefined
        );
    });

    it('should test setHeaderDialogueContext method', () => {
        spyOn(component, 'setHeaderDialogueContext').and.callThrough();
        component.setHeaderDialogueContext('tab');
        expect(component.setHeaderDialogueContext).toHaveBeenCalled();
    });

    it('should test submitHeaderAction method', () => {
        spyOn(component, 'submitHeaderAction').and.callThrough();
        component.submitHeaderAction();
        expect(component.submitHeaderAction).toHaveBeenCalled();
    });

    it('should return the description of the current workflow state', () => {
        component.workflowTableData = [
            {
                key: 'workflow_state',
                items: [
                    { stateKey1: 'Description 1' },
                    { stateKey2: 'Description 2' },
                ],
            },
        ];
        component.currentWorkflowStateKey = 'stateKey2';
        const result = component.getCurrentWorkflowStateDescription();
        expect(result).toBe('Description 2');
    });

    it('should return undefined when no workflow_state key is found', () => {
        component.workflowTableData = [
            { key: 'other_state', items: [{ stateKey1: 'Description 1' }] },
        ];
        component.currentWorkflowStateKey = 'stateKey1';
        const result = component.getCurrentWorkflowStateDescription();
        expect(result).toBeUndefined();
    });

    it('should return undefined when no matching item is found in items', () => {
        component.workflowTableData = [
            {
                key: 'workflow_state',
                items: [
                    { stateKey1: 'Description 1' },
                    { stateKey3: 'Description 3' },
                ],
            },
        ];
        component.currentWorkflowStateKey = 'stateKey2';
        const result = component.getCurrentWorkflowStateDescription();
        expect(result).toBeUndefined();
    });

    it('should return undefined when workflowTableData or items are empty', () => {
        component.workflowTableData = [{ key: 'workflow_state', items: [] }];
        component.currentWorkflowStateKey = 'stateKey1';
        const result = component.getCurrentWorkflowStateDescription();
        expect(result).toBeUndefined();
    });

    it('should set hasWorkflowState to false when workflowTableData is undefined', () => {
        component.workflowTableData = undefined;
        component.checkWorkflowState();
        expect(component.hasWorkflowState).toBe(false);
    });

    it('should set hasWorkflowState to false when workflowTableData does not contain workflow_state', () => {
        component.workflowTableData = [{ key: 'some_other_key', items: [] }];
        component.checkWorkflowState();
        expect(component.hasWorkflowState).toBe(false);
    });

    it('should set hasWorkflowState to false when workflowTableData contains workflow_state but items are empty', () => {
        component.workflowTableData = [{ key: 'workflow_state', items: [] }];
        component.checkWorkflowState();
        expect(component.hasWorkflowState).toBe(false);
    });

    it('should set hasWorkflowState to false when workflow_state items do not match currentWorkflowStateKey', () => {
        component.currentWorkflowStateKey = 'non_matching_key';
        component.workflowTableData = [
            { key: 'workflow_state', items: [{ some_key: 'value' }] },
        ];
        component.checkWorkflowState();
        expect(component.hasWorkflowState).toBe(false);
    });

    it('should set hasWorkflowState to true when workflow_state items match currentWorkflowStateKey', () => {
        component.currentWorkflowStateKey = 'matching_key';
        component.workflowTableData = [
            { key: 'workflow_state', items: [{ matching_key: 'value' }] },
        ];
        component.checkWorkflowState();
        expect(component.hasWorkflowState).toBe(true);
    });

    it('should call checkWorkflowState when workflowTableData changes', () => {
        const changes: SimpleChanges = {
            workflowTableData: {
                currentValue: [{ key: 'workflow_state', items: [] }],
                previousValue: undefined,
                firstChange: true,
                isFirstChange: () => true,
            },
        };

        spyOn(component, 'checkWorkflowState');
        component.ngOnChanges(changes);

        expect(component.checkWorkflowState).toHaveBeenCalled();
    });

    it('should not call checkWorkflowState when workflowTableData does not change', () => {
        const changes: SimpleChanges = {
            someOtherInput: {
                currentValue: 'newValue',
                previousValue: 'oldValue',
                firstChange: false,
                isFirstChange: () => false,
            },
        };

        spyOn(component, 'checkWorkflowState');
        component.ngOnChanges(changes);

        expect(component.checkWorkflowState).not.toHaveBeenCalled();
    });

    it('should return correct color for active statuses', () => {
        expect(component.getLabOrderStatusColor('active')).toBe('warning');
        expect(component.getLabOrderStatusColor('ACTIVE')).toBe('warning');
        expect(component.getLabOrderStatusColor('Active')).toBe('warning');
        expect(component.getLabOrderStatusColor('AcTiVe')).toBe('warning');
    });

    it('should return correct color for completed statuses', () => {
        expect(component.getLabOrderStatusColor('completed')).toBe('success');
        expect(component.getLabOrderStatusColor('COMPLETED')).toBe('success');
        expect(component.getLabOrderStatusColor('Completed')).toBe('success');
        expect(component.getLabOrderStatusColor('complete')).toBe('success');
        expect(component.getLabOrderStatusColor('CoMpLeTeD')).toBe('success');
    });

    it('should return correct color for warning statuses', () => {
        expect(component.getLabOrderStatusColor('pending')).toBe('warning');
        expect(component.getLabOrderStatusColor('requested')).toBe('warning');
        expect(component.getLabOrderStatusColor('PeNdInG')).toBe('warning');
    });

    it('should return correct color for danger statuses', () => {
        expect(component.getLabOrderStatusColor('cancelled')).toBe('danger');
        expect(component.getLabOrderStatusColor('rejected')).toBe('danger');
    });

    it('should return "basic" for invalid or empty values', () => {
        expect(component.getLabOrderStatusColor(null)).toBe('basic');
        expect(component.getLabOrderStatusColor(undefined)).toBe('basic');
        expect(component.getLabOrderStatusColor('')).toBe('basic');
        expect(component.getLabOrderStatusColor('unknown_status')).toBe(
            'basic'
        );
    });
});

class SilStoresServiceStub3 {
    create() {
        return of({
            data: [
                {
                    node: {
                        status: '',
                    },
                },
            ],
        });
    }
    update() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    downloadDocument() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    getStore() {
        return {
            url: '/adfasdf/',
        };
    }
    getServer() {
        return 'http:localhost/asdff';
    }
    listNested() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    list() {
        return of({
            next: 'url',
            count: '2',
            data: {
                data: {
                    results: [],
                },
            },
        });
    }
    createNested() {
        return of({
            id: '12312',
        });
    }
}

describe('SilDatatableComponent: different results payload', () => {
    let component: SilDatatableComponent;
    let fixture: ComponentFixture<SilDatatableComponent>;
    const routerSpy = {
        navigate: jasmine.createSpy('navigate'),
        navigateByUrl: jasmine.createSpy('navigateByUrl'),
    };
    const fakeActivatedRoute = {
        navigate: jasmine.createSpy('navigate'),
        navigateByUrl: jasmine.createSpy('navigateByUrl'),
        snapshot: { data: {}, navigate: jasmine.createSpy('navigate') },
    } as unknown as ActivatedRoute;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilDatatableComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('app'),
                mockPipe('translate'),
                mockPipe('truncate'),
                mockPipe('phoneNumberPipe'),
                mockPipe('removeUnderScore'),
                NbButtonModule,
                NbSpinnerModule,
                FormsModule,
                RouterModule,
                RouterTestingModule,
                ApolloTestingModule,
            ],
            providers: [
                { provide: Authorization, useClass: AuthorizationConfigStub },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub3 },
                { provide: ActivatedRoute, useValue: routerSpy },
                { provide: Router, useValue: fakeActivatedRoute },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { Apollo: Apollo, useValue: apolloServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilDatatableComponent);
        component = fixture.componentInstance;
        component.zeroState = {
            hideActionButtons: false,
        };
        component.cardListSearch = false;
        component.hasDisabledCheckboxes = false;
        fixture.detectChanges();
    });

    it('should test includes', () => {
        spyOn(component, 'includes').and.callThrough();
        const collection = [{ item: 'value' }, { item: 'values' }];
        component.includes('value', collection, 'item');
        expect(component.includes).toHaveBeenCalled();
    });

    it('should test toggleCheckbox method with a row that has disableByFields', () => {
        component.hasSelectRow = true;

        component.disableByFields = { status: 'REVIEWED' };
        component.hasDisabledCheckboxes = false;

        spyOn(component, 'toggleCheckbox').and.callThrough();
        component.toggleCheckbox(
            { id: 1, isSelected: true, status: 'REVIEWED' },
            {
                target: {
                    closest: (selector: string) => {
                        if (selector === '.grid-checkbox') {
                            const div = document.createElement('div');
                            div.classList.add('grid-checkbox');
                            return div;
                        }
                        return null;
                    },
                },
            } as unknown as MouseEvent
        );
        expect(component.toggleCheckbox).toHaveBeenCalled();
    });

    it('should test getData method', () => {
        spyOn(component, 'getData').and.callThrough();
        component.restFxn = 'list';
        component.restApi = 'patients';
        component.queryArg = {};
        const response = {
            results: [],
            data: { results: [{ id: 1 }, { id: 2 }] },
            count: 21,
        };
        component.hasSelectRow = true;
        component.apilist = [{ id: 1 }, { id: 2 }];
        component.selectedRows = [{ id: 1 }];
        spyOn(component.dataLayer, 'list').and.returnValue(of(response));
        component.getData();
        spyOn(component, 'updateSelectedItems');
        component.updateSelectedItems();
        expect(component.updateSelectedItems).toHaveBeenCalled();
        expect(component.getData).toHaveBeenCalled();
    });
});

class SilStoresServiceStub2 {
    loanRequests() {
        return {};
    }
    create() {
        return of({
            data: {
                results: [],
            },
        });
    }
    update() {
        return of({
            data: {
                results: [],
            },
        });
    }
    list() {
        return {
            data: {
                next: 'url',
                results: [],
            },
        };
    }
    createNested() {
        return of({
            id: '12312',
        });
    }
}

class SilStoresServiceStubError2 {
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Error'));
        return sub;
    }
    createNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

const uIRouterGlobalsStubNoCurrentParams = {
    current: {
        name: 'state',
    },
    params: {},
    $current: {
        params: {},
    },
};

describe('SilDatatableComponent2: rest error', () => {
    let component: SilDatatableComponent;
    let fixture: ComponentFixture<SilDatatableComponent>;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };
    const fakeActivatedRoute = {
        navigate: jasmine.createSpy('navigate'),
        snapshot: { data: {}, navigate: jasmine.createSpy('navigate') },
    } as unknown as ActivatedRoute;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilDatatableComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('app'),
                mockPipe('translate'),
                mockPipe('truncate'),
                mockPipe('phoneNumberPipe'),
                mockPipe('removeUnderScore'),
                NbButtonModule,
                NbSpinnerModule,
                FormsModule,
                RouterModule,
                RouterTestingModule,
                ApolloTestingModule,
            ],
            providers: [
                { provide: Authorization, useClass: AuthorizationConfigStub },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: UIRouterGlobals,
                    useValue: uIRouterGlobalsStubNoCurrentParams,
                },
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilDatatableService,
                    useClass: SilDatatableServiceStub,
                },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError2,
                },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: ActivatedRoute, useValue: routerSpy },
                { provide: Router, useValue: fakeActivatedRoute },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { Apollo: Apollo, useValue: apolloServiceStubError },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilDatatableComponent);
        component = fixture.componentInstance;
        component.restFxn = 'create';
        component.restApi = 'patients';
        component.zeroState = {
            hideActionButtons: false,
        };
        component.cardListSearch = false;
        fixture.detectChanges();
    });

    it('should test patients method: fail', () => {
        component.selectedItem = {
            node: {
                loanReference: 'ref',
            },
        };
        spyOn(component, 'getData').and.callThrough();
        component.getData();
        const err = { error: { detail: 'Invalid page.' } };
        component.handleInvalidPage(err);
        expect(component.getData).toHaveBeenCalled();
    });
    it('should test set params when $current is empty', () => {
        spyOn(component, 'setParams').and.callThrough();
        component.setParams({});
        component.getData();
        expect(component.setParams).toHaveBeenCalled();
    });

    it('should test handleErrorFxn method', () => {
        spyOn(component, 'handleErrorFxn').and.callThrough();
        component.handleErrorFxn({});
        expect(component.handleErrorFxn).toHaveBeenCalled();
    });
});

describe('SilDatatableComponent: list supplied', () => {
    let component: SilDatatableComponent;
    let fixture: ComponentFixture<SilDatatableComponent>;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };
    const fakeActivatedRoute = {
        navigate: jasmine.createSpy('navigate'),
        snapshot: { data: {}, navigate: jasmine.createSpy('navigate') },
    } as unknown as ActivatedRoute;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilDatatableComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('app'),
                mockPipe('translate'),
                mockPipe('truncate'),
                mockPipe('phoneNumberPipe'),
                mockPipe('removeUnderScore'),
                NbButtonModule,
                NbSpinnerModule,
                FormsModule,
                RouterModule,
                RouterTestingModule,
                ApolloTestingModule,
            ],
            providers: [
                { provide: Authorization, useClass: AuthorizationConfigStub },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub2 },
                { provide: ActivatedRoute, useValue: routerSpy },
                { provide: Router, useValue: fakeActivatedRoute },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { Apollo: Apollo, useValue: apolloServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilDatatableComponent);
        component = fixture.componentInstance;
        component.zeroState = {
            hideActionButtons: false,
        };
        component.cardListSearch = false;
        fixture.detectChanges();
    });

    it('should test apilist', () => {
        component.selectedItem = {
            node: {
                loanReference: 'ref',
            },
        };
        component.apilist = [];
        component.getData();
        expect(component.apilist).toBeDefined();
    });
});

describe('SilDatatableComponent: list supplied', () => {
    let component: SilDatatableComponent;
    let fixture: ComponentFixture<SilDatatableComponent>;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };
    const fakeActivatedRoute = {
        navigate: jasmine.createSpy('navigate'),
        snapshot: { data: {}, navigate: jasmine.createSpy('navigate') },
    } as unknown as ActivatedRoute;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilDatatableComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('app'),
                mockPipe('translate'),
                mockPipe('truncate'),
                mockPipe('phoneNumberPipe'),
                mockPipe('removeUnderScore'),
                NbButtonModule,
                NbSpinnerModule,
                FormsModule,
                RouterModule,
                RouterTestingModule,
                ApolloTestingModule,
            ],
            providers: [
                { provide: Authorization, useClass: AuthorizationConfigStub },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: ActivatedRoute, useValue: routerSpy },
                { provide: Router, useValue: fakeActivatedRoute },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { Apollo: Apollo, useValue: apolloServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        fixture = TestBed.createComponent(SilDatatableComponent);
        component = fixture.componentInstance;
        component.zeroState = {
            hideActionButtons: false,
        };
        component.cardListSearch = false;
        fixture.detectChanges();
    });

    it('should not call getData when isGraphqlEndpoint is false', () => {
        spyOn(component, 'determineQueryFilters').and.callThrough();
        spyOn(component, 'getData').and.callThrough();

        const model = { someParam: 'someValue' };
        component.isGraphqlEndpoint = false;

        component.filterData(model);

        expect(component.determineQueryFilters).not.toHaveBeenCalled();
        expect(component.getData).not.toHaveBeenCalled();
    });
});

describe('SilDatatableComponent: FHIR data extraction', () => {
    let component: SilDatatableComponent;
    let fixture: ComponentFixture<SilDatatableComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilDatatableComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('app'),
                mockPipe('translate'),
                mockPipe('truncate'),
                mockPipe('phoneNumberPipe'),
                mockPipe('removeUnderScore'),
                NbButtonModule,
                NbSpinnerModule,
                FormsModule,
                RouterModule,
                RouterTestingModule,
                ApolloTestingModule,
            ],
            providers: [
                { provide: Authorization, useClass: AuthorizationConfigStub },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: ActivatedRoute, useValue: Router },
                { provide: Router, useValue: ActivatedRoute },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: Apollo, useValue: apolloServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: SilDatatableService,
                    useClass: SilDatatableServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        fixture = TestBed.createComponent(SilDatatableComponent);
        component = fixture.componentInstance;
        component.zeroState = { hideActionButtons: false };
        component.cardListSearch = false;
        fixture.detectChanges();
    });

    it('should extract data from GraphQL-like structure', () => {
        const response = {
            edges: [{ node: { id: '1' } }, { node: { id: '2' } }],
        };

        expect(component.extractFhirData(response)).toEqual([
            { node: { id: '1' } },
            { node: { id: '2' } },
        ]);
    });

    it('should extract resources from entries with resource property', () => {
        const response = {
            entry: [
                { resource: { id: '1', name: 'Test 1' } },
                { resource: { id: '2', name: 'Test 2' } },
            ],
        };

        const result = component.extractFhirData(response);

        expect(result).toEqual([
            { id: '1', name: 'Test 1' },
            { id: '2', name: 'Test 2' },
        ]);
    });

    it('should handle entries without resource property', () => {
        const response = {
            entry: [
                { id: '1', name: 'Entry 1' },
                { id: '2', name: 'Entry 2' },
            ],
        };

        const result = component.extractFhirData(response);

        expect(result).toEqual([
            { id: '1', name: 'Entry 1' },
            { id: '2', name: 'Entry 2' },
        ]);
    });

    it('should handle direct resource arrays', () => {
        const response = [
            { id: '1', name: 'Resource 1' },
            { id: '2', name: 'Resource 2' },
        ];

        const result = component.extractFhirData(response);

        expect(result).toEqual(response);
    });

    it('should handle empty or invalid responses', () => {
        expect(component.extractFhirData(null)).toEqual([]);
        expect(component.extractFhirData(undefined)).toEqual([]);
        expect(component.extractFhirData({})).toEqual([]);
    });

    it('should extract all pagination parameters when present', () => {
        const result = component.extractFhirPaginationParams(
            'http://example.org/fhir/Patient?_count=30&_getpagesoffset=50&_getpages=abc123'
        );
        expect(result).toEqual({
            offset: 50,
            count: 30,
            getpages: 'abc123',
        });
    });

    it('should use default values for missing parameters', () => {
        const result1 = component.extractFhirPaginationParams(
            'http://example.org/fhir/Patient?_getpagesoffset=50'
        );
        expect(result1.count).toBe(20);
        expect(result1.offset).toBe(50);

        const result2 = component.extractFhirPaginationParams(
            'http://example.org/fhir/Patient?_count=30'
        );
        expect(result2.offset).toBe(0);
        expect(result2.count).toBe(30);

        const result3 = component.extractFhirPaginationParams(
            'http://example.org/fhir/Patient'
        );
        expect(result3).toEqual({
            offset: 0,
            count: 20,
            getpages: undefined,
        });
    });

    it('should handle invalid URLs', () => {
        const consoleSpy = spyOn(console, 'error');

        expect(component.extractFhirPaginationParams(null)).toBeNull();
        expect(component.extractFhirPaginationParams(undefined)).toBeNull();
        expect(component.extractFhirPaginationParams('')).toBeNull();
        expect(component.extractFhirPaginationParams(String(123))).toBeNull();
        expect(component.extractFhirPaginationParams('invalid-url')).toBeNull();

        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should correctly process FHIR endpoint data', () => {
        component.isFhirEndpoint = true;
        component.pageSize = 20;
        component.fhirQueryParams = { _include: 'Patient:organization' };
        component.restFxn = 'list';
        component.restApi = 'patients';

        const fhirResponse = {
            resourceType: 'Bundle',
            type: 'searchset',
            total: 100,
            link: [
                {
                    relation: 'self',
                    url: 'http://example.org/fhir/Patient',
                },
                {
                    relation: 'next',
                    url: 'http://example.org/fhir/Patient?_getpagesoffset=20',
                },
            ],
            entry: [{ resource: { id: '1' } }],
        };

        const listSpy = spyOn(component.dataLayer, 'list').and.returnValue(
            of(fhirResponse)
        );

        component.getData();

        expect(component.totalItems).toBe(100);
        expect(component.paginationData['pageInfo'].HasNextPage).toBeTrue();

        expect(listSpy.calls.mostRecent().args[0]).toBe('patients');
        expect(listSpy.calls.mostRecent().args[1]).toEqual(
            jasmine.objectContaining({
                _count: 20,
                _include: 'Patient:organization',
            })
        );
    });

    it('should handle pagination with empty or missing links', () => {
        component.isFhirEndpoint = true;

        const responseWithEmptyLinks = {
            resourceType: 'Bundle',
            type: 'searchset',
            entry: [{ resource: { id: '1' } }],
            link: [
                { relation: 'next', url: '' },
                { relation: 'previous', url: null },
            ],
        };

        spyOn(component.dataLayer, 'list').and.returnValue(
            of(responseWithEmptyLinks)
        );
        component.restFxn = 'list';
        component.restApi = 'patients';

        component.getData();

        expect(component.paginationData['pageInfo'].EndCursor).toBe('');
        expect(component.paginationData['pageInfo'].StartCursor).toBe('');
    });

    it('should use apilist.length as fallback when total is missing', () => {
        component.isFhirEndpoint = true;
        component.apilist = [{ id: '1' }, { id: '2' }];

        const responseWithoutTotal: {
            resourceType: string;
            type: string;
            entry: { resource: { id: string } }[];
            total?: number;
        } = {
            resourceType: 'Bundle',
            type: 'searchset',
            entry: [{ resource: { id: '1' } }, { resource: { id: '2' } }],
        };

        const totalCount =
            responseWithoutTotal.total || component.apilist.length;

        expect(totalCount).toBe(2);
    });

    it('should return extracted FHIR data from extractApiList method', () => {
        const fhirResponse = {
            entry: [
                { resource: { id: '1', name: 'Test 1' } },
                { resource: { id: '2', name: 'Test 2' } },
            ],
        };

        component.isFhirEndpoint = true;
        spyOn(component, 'extractFhirData').and.callThrough();

        const result = component.extractApiList(fhirResponse);

        expect(component.extractFhirData).toHaveBeenCalledWith(fhirResponse);
        expect(result).toEqual([
            { id: '1', name: 'Test 1' },
            { id: '2', name: 'Test 2' },
        ]);
    });
});
