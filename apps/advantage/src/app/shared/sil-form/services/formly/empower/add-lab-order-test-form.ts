import { Injectable } from '@angular/core';
/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the add lab order form service
 */
export class AddLabOrderTestService {
    /**
     * Component reference to SilFormComponent
     * @returns fields information
     */
    component: any;

    /**
     *
     * Tests to be done
     */
    tests: Array<any> = [];

    /**
     *
     * Test results
     *
     */
    resultList: Array<any> = [];

    /**
     *
     * Selected test
     */
    selectedTest: any;

    /**
     *
     * Test results of the regular tests (Biopsy)
     */
    regularTestResults: Array<any> = [];

    /**
     * Stores form data from api
     */
    model: any = {};

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'selected_result',
                type: 'select',
                className: 'col-12 input-flex-one display-grid pad-t-12',
                props: {
                    label: 'Test result',
                    placeholder: 'Select result',
                    required: true,
                    bindLabel: 'title',
                    bindValue: 'value',
                    closeOnSelect: true,
                    options: [...this.resultList],
                },
            },
            {
                key: 'attachment',
                type: 'file',
                className: 'my-4 col-12',
                props: {
                    label: 'Upload attachment',
                    placeholder: '',
                    required: false,
                    bindLabel: 'value',
                    bindValue: 'value',
                    addFile: model => {
                        this.model['file'] = model.file;
                    },
                },
                expressions: {
                    'model.attachment': field => {
                        return field.model?.attachment;
                    },
                    'model.file': () => {
                        return this.model.file;
                    },
                },
                modelOptions: {
                    updateOn: 'change',
                    debounce: {
                        default: 10,
                    },
                },
            },
            {
                key: 'remarks',
                type: 'textarea',
                className: 'col-12',
                props: {
                    required: true,
                    label: 'Remarks',
                    placeholder: 'Add additional remarks here',
                    rows: 4,
                },
            },
        ];
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
        if (component && component.secondaryData) {
            this.selectedTest = component.secondaryData.selected_test;
            this.resultList = component.secondaryData.resultList;
        }
    }
}
