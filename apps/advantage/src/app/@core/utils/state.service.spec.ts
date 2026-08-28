import { LocalStateService } from './state.service';
import { TestBed } from '@angular/core/testing';
import { NbLayoutDirectionService, NbLayoutDirection } from '@nebular/theme';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/core';
import { of } from 'rxjs';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

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
}
class TransitionStub {
    params() {
        return { appointment_id: 1 };
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params() {
        return { appointment_id: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { appointment_id: 1 };
        },
    },
};

class NbLayoutDirectionServStub {
    changeLayoutSize() {
        return {};
    }
    onDirectionChange() {
        return of([{ currentBreakpoint: { width: {} } }, {}]);
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

describe('LocalStateService', () => {
    let service: LocalStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [RouterTestingModule],
            providers: [
                LocalStateService,
                {
                    provide: NbLayoutDirectionService,
                    useClass: NbLayoutDirectionServStub,
                },
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: NbLayoutDirection, useClass: NbLayoutDirectionStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });
    beforeEach(() => {
        service = TestBed.inject(LocalStateService);
    });

    it('should test methods', () => {
        spyOn(service, 'getFinalFilters').and.callThrough();
        spyOn(service, 'ngOnDestroy').and.callThrough();
        service.setLayoutState('state');
        service.getLayoutStates();
        service.onLayoutState();
        service.setSidebarState('state');
        service.getSidebarStates();
        service.getFinalFilters();
        service.onSidebarState();
        service.ngOnDestroy();
        expect(service.getFinalFilters).toHaveBeenCalled();
    });
});

const uIRouterGlobalsStub2 = {
    current: {
        name: 'state',
    },
    params: {
        appointment_id: 1,
        id: 1,
        schedule: 1,
    },
    $current: {
        is: () => true,
        params: {
            appointment_id: 1,
            schedule_id: 1,
        },
    },
};

describe('getFinalFilters', () => {
    let service: LocalStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [RouterTestingModule],
            providers: [
                LocalStateService,
                {
                    provide: NbLayoutDirectionService,
                    useClass: NbLayoutDirectionServStub,
                },
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: NbLayoutDirection, useClass: NbLayoutDirectionStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });
    beforeEach(() => {
        service = TestBed.inject(LocalStateService);
    });

    it('should test when getFinalFilters has new filters', () => {
        spyOn(service, 'getFinalFilters').and.callThrough();
        service.getFinalFilters();
        expect(service.getFinalFilters).toHaveBeenCalled();
    });
});

class NbLayoutDirectionStub2 {
    changeLayoutSize() {
        return {};
    }
    LTR() {
        return true;
    }
}

class NbLayoutDirectionServStub2 {
    changeLayoutSize() {
        return {};
    }
    onDirectionChange() {
        return of('ltr');
    }
    getDirection() {
        return of([{ currentBreakpoint: { width: {} } }, {}]);
    }
}

const uIRouterGlobalsStub3 = {
    current: {
        name: 'state',
    },
    params: {},
    $current: {
        is: () => true,
        params() {
            return { appointment_id: 1 };
        },
    },
};

describe('LocalStateService: isLtr', () => {
    let service: LocalStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [RouterTestingModule],
            providers: [
                LocalStateService,
                {
                    provide: NbLayoutDirectionService,
                    useClass: NbLayoutDirectionServStub2,
                },
                {
                    provide: NbLayoutDirection,
                    useClass: NbLayoutDirectionStub2,
                },
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub3 },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });
    beforeEach(() => {
        service = TestBed.inject(LocalStateService);
    });

    it('should test methods', () => {
        spyOn(service, 'getFinalFilters').and.callThrough();
        service.getFinalFilters();
        service.setLayoutState('state');
        expect(service.getFinalFilters).toHaveBeenCalled();
    });
});
