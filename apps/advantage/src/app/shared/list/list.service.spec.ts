import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { ListComponentService } from './list.services';
import { SilStoresService } from '../sil-http-services/sil_datalayer.service';
import { BehaviorSubject } from 'rxjs';

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: '143224',
                    clinical_facility_id: 'sdsewerwjampisu9',
                    clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
                },
            ],
        });
    }
}

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('List Component Service', () => {
    let service: ListComponentService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
            ],
        });
        service = TestBed.inject(ListComponentService);
    });

    it('should test fetching the apiCall function without dataMessage defined', () => {
        spyOn(service, 'apiCall').and.callThrough();
        const comp = {
            loading: {
                loadTaxes: false,
            },
            siltable: {
                getData: () => {},
            },
            showToast: () => {},
        };
        const config = {
            loadingState: 'loadTaxes',
            httpMethod: 'list',
            api: 'products',
            successTitle: 'List of Clinical Facilities',
        };
        spyOn(comp.siltable, 'getData').and.callThrough();
        service.apiCall(config, comp);
        expect(comp.loading.loadTaxes).toEqual(false);
        expect(comp.siltable.getData).toHaveBeenCalled();
    });

    it('should test fetching the apiCall function with dataMessage defined', () => {
        spyOn(service, 'apiCall').and.callThrough();
        const comp = {
            loading: {
                loadTaxes: false,
            },
            siltable: {
                getData: () => {},
            },
            showToast: () => {},
        };
        const config = {
            loadingState: 'loadTaxes',
            httpMethod: 'list',
            api: 'products',
            dataMessage: 'Product updated successfully',
            dataTitle: 'Product Update',
        };
        spyOn(comp.siltable, 'getData').and.callThrough();
        service.apiCall(config, comp);
        expect(comp.loading.loadTaxes).toEqual(false);
        expect(comp.siltable.getData).toHaveBeenCalled();
    });
});

describe('List Component Service : Error', () => {
    let service: ListComponentService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
            ],
        });
        service = TestBed.inject(ListComponentService);
    });

    it('should test fetching the apiCall function without dataMessage defined', () => {
        spyOn(service, 'apiCall').and.callThrough();
        const comp = {
            loading: {
                loadTaxes: false,
            },
            siltable: {
                getData: () => {},
            },
            showToast: () => {},
            errorHandler: {
                handleError: () => {},
            },
        };
        const config = {
            loadingState: 'loadTaxes',
            httpMethod: 'list',
            api: 'products',
            successTitle: 'List of Clinical Facilities',
        };
        service.apiCall(config, comp);
        expect(comp.loading.loadTaxes).toEqual(false);
        expect(service.apiCall).toHaveBeenCalled();
    });
});
