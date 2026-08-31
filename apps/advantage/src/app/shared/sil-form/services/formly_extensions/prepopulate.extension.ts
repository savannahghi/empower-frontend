import { FormlyExtension } from '@ngx-formly/core';
import _ from 'underscore';

/** defines a formly extension used to prepopulate model information */

/**
 * Method used get a nested value
 */
const mineValue = (obj, path) => {
    if (!path) return obj;
    const properties = path.split('.');
    if (!obj[properties[0]]) {
        return undefined;
    }
    return mineValue(obj[properties.shift()], properties.join('.'));
};

const setModel = (model, fieyld) => {
    const key = JSON.parse(JSON.stringify(fieyld.key));
    if (model[`${fieyld.key}`]) {
        return model[`${fieyld.key}`];
    } else if (key.includes('.')) {
        return mineValue(model, key);
    }
};

export const prepopulateExtension: FormlyExtension = {
    prePopulate(field) {
        if (field.fieldGroup && field.fieldGroup.length > 0) {
            field.fieldGroup?.forEach(formfield => {
                if (formfield.key && field.model && !_.isEmpty(field.model)) {
                    const value = setModel(field.model, formfield);
                    formfield.defaultValue = value;
                }
                if (field.fieldGroup && field.fieldGroup.length > 0) {
                    if (
                        formfield.key &&
                        field.model &&
                        !_.isEmpty(field.model)
                    ) {
                        const value = setModel(field.model, formfield);
                        formfield.defaultValue = value;
                    }
                }
            });
        }
    },
};
