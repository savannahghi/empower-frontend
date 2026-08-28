import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

import { FacilitiesService } from '../../../../features/healthcrm/facilities/facilities.service';

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

    submitBusinessDocuments(model) {
        this.facilitiesService.submitBusinessDocuments(model);
        this.toggleModal('attachment');
    }

    submitBankDocuments(model) {
        this.facilitiesService.submitBankDocuments(model);
        this.toggleModal('attachment');
    }

    constructor(private facilitiesService: FacilitiesService) {
        super();
    }

    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'modelChange',
        };

        this.documents = this.facilitiesService.documents;
    }
}
