import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { GroupDetailsComponent } from './group-details.component';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { StateService } from '@uirouter/angular';

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class AuthorizationStub {
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getOrganisation() {
        return {
            bp_type: 'PROVIDER',
        };
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
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

describe('GroupDetailsComponent', () => {
    let component: GroupDetailsComponent;
    let fixture: ComponentFixture<GroupDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [GroupDetailsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GroupDetailsComponent);
        component = fixture.componentInstance;
        component.groupObservable = of({
            id: 1,
            person: { gender: 'MALE' },
            clinical_id: '282828',
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

describe('GroupDetailsComponent: error', () => {
    let component: GroupDetailsComponent;
    let fixture: ComponentFixture<GroupDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [GroupDetailsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GroupDetailsComponent);
        component = fixture.componentInstance;
        component.groupObservable = throwError(() => new Error('test'));
        fixture.detectChanges();
    });

    it('should create but fail to get group details', () => {
        expect(component).toBeTruthy();
    });
});
