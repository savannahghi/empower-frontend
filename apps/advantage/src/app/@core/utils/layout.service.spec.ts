import { LayoutService } from './layout.service';
import { TestBed } from '@angular/core/testing';
import { NbLayoutDirectionService, NbLayoutDirection } from '@nebular/theme';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class NbLayoutDirectionServStub {
    changeLayoutSize() {
        return {};
    }
    getDirection() {
        return of([{ currentBreakpoint: { width: {} } }, {}]);
    }
}

class NbLayoutDirectionStub {
    changeLayoutSize() {
        return {};
    }
}

describe('LayoutService', () => {
    let service: LayoutService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [RouterTestingModule],
            providers: [
                LayoutService,
                {
                    provide: NbLayoutDirectionService,
                    useClass: NbLayoutDirectionServStub,
                },
                { provide: NbLayoutDirection, useClass: NbLayoutDirectionStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });
    beforeEach(() => {
        service = TestBed.inject(LayoutService);
    });

    it('should test methods', () => {
        spyOn(service, 'changeLayoutSize').and.callThrough();
        service.changeLayoutSize();
        service.onChangeLayoutSize();
        expect(service.changeLayoutSize).toHaveBeenCalled();
    });
});
