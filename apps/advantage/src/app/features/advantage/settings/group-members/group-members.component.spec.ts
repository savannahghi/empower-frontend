import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { of } from 'rxjs';
import { AnalyticsService } from '../../../../@core/utils';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { GroupMembersComponent } from './group-members.component';

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params: {
        error: '403',
    },
    $current: {
        is: () => true,
    },
};

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: '143224',
                },
            ],
        });
    }
    get() {
        return of({
            id: '143224',
        });
    }
    create() {
        return of({
            id: '143224',
        });
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
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

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

describe('GroupMembersComponent', () => {
    let component: GroupMembersComponent;
    let fixture: ComponentFixture<GroupMembersComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [GroupMembersComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GroupMembersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        component.submitGroupMember({ person: '123' });
        component.toggleModal();
        expect(component).toBeTruthy();
    });
});
