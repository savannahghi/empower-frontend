import { GetConditionListFromOcl } from './clinical-ocl.service';
import { SilStoresService } from '../../shared/sil-http-services/sil_datalayer.service';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DataLayerUtils } from '../../@core/auth/services/datalayer.utils.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class SilStoresServiceStub {
    customUpdate() {
        return of({
            results: [
                {
                    uuid: '3200504',
                    id: '112141',
                    display_name: 'Tuberculosis',
                    source: 'CIEL',
                },
            ],
        });
    }
    list() {
        return of({
            results: [
                {
                    id: 1,
                },
            ],
        });
    }
}

describe('GetConditionListFromOcl', () => {
    let service: GetConditionListFromOcl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                DataLayerUtils,
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(GetConditionListFromOcl);
    });

    it('should test fields and observable functions', () => {
        const results = {
            results: [
                {
                    uuid: '3200504',
                    id: '112141',
                    display_name: 'Tuberculosis',
                    source: 'CIEL',
                },
            ],
        };
        spyOn(service, 'getCondition').and.callThrough();
        service.getCondition('tuber');
        service.responseFunction(results.results);
        expect(service.getCondition).toHaveBeenCalled();
    });
});
