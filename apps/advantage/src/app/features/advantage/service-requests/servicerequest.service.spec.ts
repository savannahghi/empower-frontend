import { TestBed } from '@angular/core/testing';
import { ServiceRequestService } from './servicerequest.service';
import { of } from 'rxjs';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';
import { StateService } from '@uirouter/angular';

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
    update() {
        return of({
            id: '143224',
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        });
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
}

describe('ServiceRequestService', () => {
    let service: ServiceRequestService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: ErrorHandlerService,
                    useValue: jasmine.createSpyObj('ErrorHandlerService', [
                        'handleError',
                    ]),
                },
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(ServiceRequestService);
    });

    it('should test methods', () => {
        spyOn(service, 'setServiceRequest').and.callThrough();
        service.setServiceRequest({});
        spyOn(service, 'handleError').and.callThrough();
        service.handleError({});
        spyOn(service, 'startServiceRequest').and.callThrough();
        service.startServiceRequest({ id: 1 });
        expect(service.setServiceRequest).toHaveBeenCalled();
        expect(service.handleError).toHaveBeenCalled();
    });
});
