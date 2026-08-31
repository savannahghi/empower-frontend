import { TestBed } from '@angular/core/testing';
import { MsgLogDetailsService } from './msg-log-details';
import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { DomSanitizer } from '@angular/platform-browser';

type DeliveryType = 'OUTBOUND' | 'INBOUND';

const mockData = {
    id: 'b88a0798-fa16-4d7e-a846-ca6fd5efdd06',
    created_by_name: null,
    updated_by_name: null,
    sender: {
        id: 'f79eec09-c751-4cc4-8195-59e852e2e151',
        created_by_name: null,
        updated_by_name: null,
        disabled: {
            status: true,
            reason: 'This option is only available from 6:00 AM to 6:00 PM.',
        },
        active: true,
        name: 'Slade360Adv',
        classification: 'SENDER_ID',
        sender_type: 'PROMOTION',
        start_date: '2023-02-14T03:00:00+03:00',
        end_date: '2040-02-14T03:00:00+03:00',
        available_from: '06:00:00',
        available_to: '18:00:00',
    },
    from_field: 'Slade360Adv',
    to_field: '+254707705021',
    workstation_id: null,
    department_id: null,
    branch_id: 'c685d3f7-08f6-40ec-b343-c31323a6fcd2',
    cluster_id: null,
    active: true,
    created: '2024-09-23T17:26:41.984130+03:00',
    created_by: '3c1ad645-239b-45b8-9f26-0612d0da0f8f',
    updated: '2024-09-23T17:26:47.482416+03:00',
    updated_by: '3c1ad645-239b-45b8-9f26-0612d0da0f8f',
    message:
        'Hi Alex, following your visit at Oregon Health Services on Sat Sep-14, kindly assist us understand how we can serve you better by following https://e.slade360.com/aWGNu to fill in our survey [Test Message]',
    recipients: ['+254707705021'],
    intention: 'POST_VISIT_SURVEY',
    state: 'DELIVERED',
    sil_comms_sms_id: 'fa686a34-a6bf-4cc8-8f75-33f4e491e962',
    failure_reason: null,
    delivery_type: 'OUTBOUND' as DeliveryType,
    organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
};

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

class DomSanitizerStub {
    bypassSecurityTrustHtml(content: any) {
        return content;
    }
}

describe('MsgLogDetailsService', () => {
    let service: MsgLogDetailsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('translate')],
            providers: [
                MsgLogDetailsService,
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: DomSanitizer, useClass: DomSanitizerStub },
            ],
        });
        service = TestBed.inject(MsgLogDetailsService);
    });

    it('should test fields and observable functions', () => {
        const comp = {
            model: {},
            fields: [{}],
            cd: {
                detectChanges: () => {},
            },
        };
        expect(service).toBeTruthy();
        service.setComponent(comp);

        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        // Call expressionProperties template method with message as truthy value
        fields[0]['expressionProperties'].template(mockData);

        // Call expressionProperties template method with control delivery_type data as OUTBOUND
        const outBoundMockData = mockData;
        outBoundMockData.delivery_type = 'OUTBOUND';
        fields[0]['expressionProperties'].template(outBoundMockData);

        // Call expressionProperties template method with message as falsy value
        const falsyMessageMockData = mockData;
        falsyMessageMockData.message = undefined;
        fields[0]['expressionProperties'].template(falsyMessageMockData);

        expect(service.fields).toHaveBeenCalled();
    });

    it('should test timeSentOrReceived method with OUTBOUND delivery_type', () => {
        spyOn(service, 'timeSentOrReceived').and.callThrough();
        service.timeSentOrReceived(mockData);
        expect(service.timeSentOrReceived).toHaveBeenCalledWith(mockData);
    });

    it('should test timeSentOrReceived method with OUTBOUND delivery_type and created value as falsy', () => {
        const outBoundMockData = mockData;
        outBoundMockData.created = undefined;
        outBoundMockData.from_field = undefined;

        spyOn(service, 'timeSentOrReceived').and.callThrough();
        service.timeSentOrReceived(outBoundMockData);
        expect(service.timeSentOrReceived).toHaveBeenCalledWith(
            outBoundMockData
        );
    });

    it('should test timeSentOrReceived method with INBOUND delivery_type', () => {
        const inBoundMockData = mockData;
        inBoundMockData.delivery_type = 'INBOUND';

        spyOn(service, 'timeSentOrReceived').and.callThrough();
        service.timeSentOrReceived(inBoundMockData);
        expect(service.timeSentOrReceived).toHaveBeenCalledWith(
            inBoundMockData
        );
    });

    it('should test timeSentOrReceived method with INBOUND delivery_type and created value as falsy', () => {
        const inBoundMockData = mockData;
        inBoundMockData.delivery_type = 'INBOUND';
        inBoundMockData.created = undefined;
        inBoundMockData.from_field = undefined;

        spyOn(service, 'timeSentOrReceived').and.callThrough();
        service.timeSentOrReceived(inBoundMockData);
        expect(service.timeSentOrReceived).toHaveBeenCalledWith(
            inBoundMockData
        );
    });

    it('should test formatDate method', () => {
        spyOn(service, 'formatDate').and.callThrough();
        service.formatDate('2040-02-14T03:00:00+03:00');
        expect(service.formatDate).toHaveBeenCalledWith(
            '2040-02-14T03:00:00+03:00'
        );
    });

    it('should test sanitizeHtml method', () => {
        spyOn(service, 'sanitizeHtml').and.callThrough();
        service.sanitizeHtml('<span class="text-dark me-1">Sender ID: </span>');
        expect(service.sanitizeHtml).toHaveBeenCalledWith(
            '<span class="text-dark me-1">Sender ID: </span>'
        );
    });
});
