import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
    selector: 'ngx-sil-form-table',
    templateUrl: './sil-form-table.component.html',
    styleUrls: ['./sil-form-table.component.scss'],
    standalone: false,
})
export class SilFormTableComponent
    extends FieldType<FieldTypeConfig>
    implements OnInit
{
    /**
     * Defines loading state
     */
    loading: boolean = true;

    /**
     * Used to display different toggle modals
     * Information in the table
     */
    toggle: Object = {};

    /**
     * Used to override default form configurations
     */
    formConfig: { checkExpressionOn: string };

    documents: Array<any> = [];

    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }

    /**
     * Documents are held on the field rather than persisted. Uploading them
     * belonged to facility onboarding, which is not part of this release.
     */
    submitBusinessDocuments(model) {
        this.documents = [...this.documents, model];
        this.toggleModal('attachment');
    }

    submitBankDocuments(model) {
        this.documents = [...this.documents, model];
        this.toggleModal('attachment');
    }

    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'modelChange',
        };
    }
}
