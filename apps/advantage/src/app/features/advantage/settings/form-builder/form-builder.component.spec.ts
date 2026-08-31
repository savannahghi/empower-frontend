import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { of } from 'rxjs';
import { AnalyticsService } from '../../../../@core/utils';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';

import { FormBuilderComponent } from './form-builder.component';

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

const uIRouterGlobalsStub = {
    params: {
        id: '112',
        service_request: 'wer',
        page_size: '2',
        queue: 1,
    },
    $current: {
        params: {
            page_size: '2',
        },
    },
};

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    href() {
        return `/12sadfasdf/`;
    }
    transition() {
        return true;
    }
    transitionTo() {
        return true;
    }
    reload() {
        return true;
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

class SilStoresServiceStub {
    get() {
        return of({
            id: 'grsgg342332sf',
        });
    }

    create() {
        return of({
            id: '4ed62h7281262h1',
        });
    }

    update() {
        return of({
            id: '4ed62h7281262h1',
        });
    }

    list() {
        return of({
            results: [
                {
                    id: '143224',
                },
            ],
        });
    }
}

describe('FormBuilderComponent', () => {
    let component: FormBuilderComponent;
    let fixture: ComponentFixture<FormBuilderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FormBuilderComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FormBuilderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
