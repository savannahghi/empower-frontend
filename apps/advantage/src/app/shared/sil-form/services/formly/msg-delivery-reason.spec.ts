import { TestBed } from '@angular/core/testing';
import { MsgDeliveryReasonService } from './msg-delivery-reason';
import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';

function mockPipe(name: string): Pipe {
    const metadata: Pipe = {
        name,
    };

    return Pipe(metadata)(
        class MockPipe implements PipeTransform {
            transform() {}
        }
    );
}

class SilStoresServiceStub {
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

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getUser() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
            organisation: '123',
        };
    }
}

class AuthenticationServiceStub {
    checkSetting(string) {
        return string === 'string';
    }
}

describe('MsgDeliveryReasonService', () => {
    let service: MsgDeliveryReasonService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('translate')],
            providers: [
                MsgDeliveryReasonService,
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: Authorization, useClass: AuthorizationStub },
            ],
        });
        service = TestBed.inject(MsgDeliveryReasonService);
    });

    it('should test fields and observable functions', () => {
        const comp = {
            model: {},
            fields: [
                {},
                {},
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        expect(service).toBeTruthy();
        service.setComponent(comp);

        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const mockControl = {
            sms: {
                failure_reason: 'BLACKLISTED_SENDER',
            },
        };

        fields[0]['expressionProperties'].template(mockControl);

        expect(service.fields).toHaveBeenCalled();
    });

    it('should test fields and observable functions when reasonCode is Null', () => {
        const comp = {
            model: {},
            fields: [
                {},
                {},
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        expect(service).toBeTruthy();
        service.setComponent(comp);

        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const mockControl = {
            sms: {
                failure_reason: undefined,
                message: 'Message',
            },
        };

        fields[0]['expressionProperties'].template(mockControl);
        fields[0].hideExpression();

        fields[1]['expressionProperties'].template(mockControl);
        fields[1].hideExpression();

        const mockControlWithoutMessage = {
            sms: {
                failure_reason: undefined,
                message: undefined,
            },
        };

        fields[1]['expressionProperties'].template(mockControlWithoutMessage);

        expect(service.fields).toHaveBeenCalled();
    });
});
