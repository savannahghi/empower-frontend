import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WaitingResultComponent } from './waiting-result.component';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { StateService } from '@uirouter/angular';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class AuthorizationConfigStub {
    getUser() {
        const stringified = JSON.stringify({
            business_partner: 1,
            client_types: ['PROVIDER'],
        });
        return stringified;
    }
    getOrganisation() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

class StateServiceStub {
    reload() {
        return true;
    }
    includes() {
        return true;
    }
}

class SilStoresServiceStub {
    update() {
        return of({});
    }
}

describe('WaitingResultComponent', () => {
    let component: WaitingResultComponent;
    let fixture: ComponentFixture<WaitingResultComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [WaitingResultComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
            ],
        });
        fixture = TestBed.createComponent(WaitingResultComponent);

        component = fixture.componentInstance;
        component.taskId = 'a2954aaf-4f6a-4096-8c54-8f504f219bc0';
        fixture.detectChanges();
    });

    it('should update the follow-up task', () => {
        // Arrange
        const model = {
            returned_results_task: 'Some reason',
            other_reason: 'Some notes',
        };
        const status = 'completed';
        spyOn(component.dataLayer, 'update').and.returnValue(
            of({ status: 'updated successfully' })
        );

        // Act
        component.updateFollowUpTask(model, status);

        // Assert
        expect(component.dataLayer.update).toHaveBeenCalled();
    });
    it('should test requestPreviousStep function', () => {
        spyOn(component, 'requestPreviousStep').and.callThrough();

        component.requestPreviousStep();
        expect(component.requestPreviousStep).toHaveBeenCalled();
    });

    it('should test the taskResponseFunctionWithStatus function', () => {
        spyOn(component, 'showToast');
        spyOn(component, 'toggleModal');
        spyOn(component.updateTestStatus, 'emit');
        component.taskResponseFunctionWithStatus();

        expect(component.showToast).toHaveBeenCalled();
        expect(component.toggleModal).toHaveBeenCalled();
        expect(component.submitted).toBeTrue();
        expect(component.loading).toBeFalse();
        expect(component.updateTestStatus.emit).toHaveBeenCalled();
    });
});

describe('WaitingResultComponent returns a response error', () => {
    let component: WaitingResultComponent;
    let fixture: ComponentFixture<WaitingResultComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [WaitingResultComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
            ],
        });
        fixture = TestBed.createComponent(WaitingResultComponent);

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should resolve error on task update error', () => {
        const mockModel = {
            returned_results_task: 'return sample',
            other_reason: 'other reason here',
        };
        spyOn(component.dataLayer, 'update').and.returnValue(
            throwError(() => new Error('Server error'))
        );
        spyOn(component['errorHandler'], 'handleError');

        component.updateFollowUpTask(mockModel, 'finished');

        expect(component['errorHandler'].handleError).toHaveBeenCalled();
        expect(component.loading).toBeFalse();
    });
});
