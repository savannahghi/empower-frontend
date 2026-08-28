import { TestBed } from '@angular/core/testing';
import { RecordGuideTopicFormFieldsService } from './record-guide-topic.form';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { FormlyFieldConfig } from '@ngx-formly/core';

class AuthorizationStub {
    getErpOrganisation() {
        return { organisation_id: 'org-123' };
    }
}
class AuthorizationNoOrgStub {
    getErpOrganisation() {
        return undefined;
    }
}

describe('RecordGuideTopicFormFieldsService', () => {
    let service: RecordGuideTopicFormFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
            ],
        });
        service = TestBed.inject(RecordGuideTopicFormFieldsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return correct fields config', () => {
        const fields = service.fields();
        expect(Array.isArray(fields)).toBeTrue();
        expect(fields.length).toBe(2);
        expect(fields[0].key).toBe('title');
        expect(fields[1].key).toBe('url');
        expect(fields[0].props.label).toBe('Topic Title');
        expect(fields[1].props.label).toBe('Resource URL');
        expect(fields[0].props.required).toBeTrue();
        expect(fields[1].props.required).toBeFalse();
    });

    it('should set component and organisationID if organisation exists', () => {
        const mockComponent = { foo: 'bar' };
        service.setComponent(mockComponent);
        expect(service.component).toBe(mockComponent);
        expect(service.organisationID).toBe('org-123');
    });

    it('should set organisationID to undefined if getErpOrganisation returns undefined', () => {
        const authServ = new AuthorizationNoOrgStub();
        service = new RecordGuideTopicFormFieldsService(authServ as any);
        const mockComponent = { foo: 'bar' };
        service.setComponent(mockComponent);
        expect(service.component).toBe(mockComponent);
        expect(service.organisationID).toBeUndefined();
    });

    it('should allow setting and getting public properties', () => {
        service.field = { key: 'test' } as FormlyFieldConfig;
        service.component = { foo: 'bar' };
        service.model = { a: 1 };
        service.organisationID = 'org-123';
        expect(service.field).toBeTruthy();
        expect(service.component).toBeTruthy();
        expect(service.model).toBeTruthy();
        expect(service.organisationID).toBe('org-123');
    });
});
