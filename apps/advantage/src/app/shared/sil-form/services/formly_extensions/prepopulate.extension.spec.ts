import { prepopulateExtension } from './prepopulate.extension';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormControl } from '@angular/forms';

describe('Prepopulate Extension', () => {
    let field: FormlyFieldConfig;
    const fieyld = new FormControl('name');
    beforeEach(() => {
        // Initialize the field object
        field = {
            key: 'person',
            fieldGroup: [
                /** Test simple use case of un-nested property */
                {
                    key: 'firstName',
                    model: {
                        firstName: 'John',
                        lastName: 'Doe',
                        age: 30,
                    },
                    formControl: fieyld,
                },
                /** Test nested property */
                {
                    key: 'person.otherName',
                    model: {
                        person: {
                            otherName: 'Meseeks',
                        },
                    },
                    formControl: fieyld,
                },
                /** Test when model is not defined already */
                {
                    key: 'person.contacts.primary_contact',
                    model: {
                        person: {
                            otherName: 'Meseeks',
                        },
                    },
                    formControl: fieyld,
                },
            ],
            model: {
                firstName: 'John',
                lastName: 'Doe',
                person: {
                    otherName: 'Meseeks',
                },
            },
            formControl: fieyld,
        };
    });

    it('should set expression properties correctly', () => {
        prepopulateExtension.prePopulate(field);
        expect(field.fieldGroup[0].defaultValue).toBe('John');
        expect(field.fieldGroup[1].defaultValue).toBe('Meseeks');
    });
});
