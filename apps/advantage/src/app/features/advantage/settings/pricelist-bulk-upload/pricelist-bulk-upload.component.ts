import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'ngx-pricelist-bulk-upload',
    templateUrl: './pricelist-bulk-upload.component.html',
    styleUrl: './pricelist-bulk-upload.component.scss',
    standalone: false,
})
export class PricelistBulkUploadComponent {
    /**
     * Contains selected queue used to start a visit
     */
    selectedPricelist: any;
    /**
     * Define the column headers to the expected field valuesvon the BE
     */
    fieldMappings = {
        name: 'Product Name',
        preferred_name: 'Product Name',
        purchasing_price: 'Purchase Price',
        selling_price: 'Selling Price',
        product_type: 'Product Type',
    };
    /**
     * accepted file types
     */
    acceptedFileTypes: string =
        'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    constructor(private translate: TranslateService) {}

    /** getFilteredResponse of queues from sil-combo-box*/
    getFilteredResponse(event) {
        this.selectedPricelist = event;
    }

    /**
     * download template excel sheet for bulk uploads
     */
    downloadTemplateFile() {
        const a = document.createElement('a');
        a.href = '../../../../../assets/excel/bulk_stock_upload_template.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
}
