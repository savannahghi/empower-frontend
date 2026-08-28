import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { of } from 'rxjs';
import { AnalyticsService } from '../../@core/utils/analytics.service';

import { PageComponent } from './page.component';

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

const uIRouterGlobalsStub = {
    params: {
        encounter_guid: '403',
    },
};

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

describe('PageComponentComponent', () => {
    let component: PageComponent;
    let fixture: ComponentFixture<PageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PageComponent],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(PageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should toggleModal', () => {
        component.toggleModal('form');
        component.showToast('bottom-right', 'success', 'message', 'message');
        component.showToastError(
            'bottom-right',
            'danger',
            'message',
            'message'
        );
        component.stateGo('app.feedback');
        expect(component).toBeTruthy();
    });
});
