import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RecordGuideTopicFormFieldsService } from './record-guide-topic.form';

@Injectable({
    providedIn: 'root',
})
export class RecordGuideSubtopicFormFieldsService extends RecordGuideTopicFormFieldsService {
    /**
     * Extend the topic fields and add a permission field for subtopics.
     */
    override fields(): FormlyFieldConfig[] {
        const baseFields = super.fields();
        return [
            ...baseFields,
            {
                key: 'permission',
                type: 'input',
                className: 'col-12 col-md-6 mb-3 px-2',
                props: {
                    label: 'Permission',
                    placeholder: 'Enter permission',
                    required: true,
                },
            },
        ];
    }
}
