import { TestBed } from '@angular/core/testing';
import { RecordGuideSubtopicFormFieldsService } from './record-guide-subtopic.form';
import { RecordGuideTopicFormFieldsService } from './record-guide-topic.form';
import { Authorization } from '../../../../@core/auth/services/authorization.service';

describe('RecordGuideSubtopicFormFieldsService', () => {
    let service: RecordGuideSubtopicFormFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RecordGuideSubtopicFormFieldsService,
                {
                    provide: RecordGuideTopicFormFieldsService,
                    useValue: {
                        fields: () => [
                            {
                                key: 'title',
                                type: 'input',
                                props: { label: 'Topic Title' },
                            },
                            {
                                key: 'url',
                                type: 'input',
                                props: { label: 'Resource URL' },
                            },
                        ],
                    },
                },
                {
                    provide: Authorization,
                    useValue: {
                        getErpOrganisation: () => ({
                            organisation_id: 'org-1',
                        }),
                    },
                },
            ],
        });
        service = TestBed.inject(RecordGuideSubtopicFormFieldsService);
    });

    it('should extend topic fields and add a permission field', () => {
        const fields = service.fields();
        expect(fields.some(f => f.key === 'title')).toBeTrue();
        expect(fields.some(f => f.key === 'url')).toBeTrue();
        const permissionField = fields.find(f => f.key === 'permission');
        expect(permissionField).toBeTruthy();
        expect(permissionField?.type).toBe('input');
        expect(permissionField?.props?.label).toBe('Permission');
        expect(permissionField?.props?.required).toBeTrue();
    });
});
