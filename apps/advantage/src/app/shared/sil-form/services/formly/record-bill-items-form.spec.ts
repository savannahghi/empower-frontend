import { TestBed } from '@angular/core/testing';
import { RecordBillItemsFormFieldsService } from './record-bill-items-form';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { UIRouterGlobals } from '@uirouter/angular';

describe('RecordBillItemsFormFieldsService', () => {
    let service: RecordBillItemsFormFieldsService;
    let mockDataLayer: jasmine.SpyObj<SilStoresService>;
    let mockAuth: jasmine.SpyObj<AuthenticationService>;
    let mockAuthServ: jasmine.SpyObj<Authorization>;
    let mockUIGlobals: jasmine.SpyObj<UIRouterGlobals>;

    beforeEach(() => {
        mockDataLayer = jasmine.createSpyObj('SilStoresService', ['']);
        mockAuth = jasmine.createSpyObj('AuthenticationService', ['']);
        mockAuthServ = jasmine.createSpyObj('Authorization', [
            'getErpOrganisation',
        ]);
        mockUIGlobals = jasmine.createSpyObj('UIRouterGlobals', ['']);

        TestBed.configureTestingModule({
            providers: [
                RecordBillItemsFormFieldsService,
                { provide: SilStoresService, useValue: mockDataLayer },
                { provide: AuthenticationService, useValue: mockAuth },
                { provide: Authorization, useValue: mockAuthServ },
                { provide: UIRouterGlobals, useValue: mockUIGlobals },
            ],
        });
        service = TestBed.inject(RecordBillItemsFormFieldsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return form fields', () => {
        const fields = service.fields();
        expect(fields.length).toBeGreaterThan(0);
        expect(fields[0].key).toBe('name');
        expect(fields[1].key).toBe('expense_account');
        expect(fields[2].key).toBe('new_price');
        expect(fields[3].key).toBe('description');
    });

    it('should set component and organisation ID', () => {
        const mockComponent = {};
        const mockOrg = { organisation_id: 'test-org-id' };
        mockAuthServ.getErpOrganisation.and.returnValue(mockOrg);

        service.setComponent(mockComponent);
        expect(service.component).toBe(mockComponent);
        expect(service.organisationID).toBe('test-org-id');
    });
});
