import { Component, Input, OnInit } from '@angular/core';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { PriceListFileUploadDetailsModel } from '../../models/PriceListFileUploadDetails.model';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';

@Component({
    selector: 'ngx-pricelist-file-details',
    templateUrl: './pricelist-file-details.component.html',
    styleUrls: ['./pricelist-file-details.component.scss'],
    standalone: false,
})
export class PricelistFileUploadDetailsComponent implements OnInit {
    /** contains uploaded price list data information */
    uploadedDataInfo: PriceListFileUploadDetailsModel;

    /** Contains the observable resolved from the state service */
    @Input() pricelistUploadFileObservable: any;

    /** Saves the selected language */
    selectedLanguage = this.cookieService.getLanguageCookie();

    /**
     * Constructor for the PricelistFileDetailsComponent class
     * @param cookieService Access instance of Cookies service
     * @param errorHandler Access instance of ErrorHandlerService
     * @param translate Access instance of TranslateService
     */
    constructor(
        public cookieService: Cookies,
        public errorHandler: ErrorHandlerService,
        public translate: TranslateService
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
    }

    /** Hook called when component is initialized */
    ngOnInit() {
        this.getUploadedDataInfo();
    }

    receivePriceListUploadData = (
        response: PriceListFileUploadDetailsModel
    ) => {
        this.uploadedDataInfo = response;
    };

    handleErrorFxn = err => {
        console.error('handleErrorFxn - Error occurred:', err);
        this.errorHandler.handleError(err, this);
    };

    /** Fetches the uploaded price list data information */
    getUploadedDataInfo() {
        this.pricelistUploadFileObservable.subscribe({
            next: this.receivePriceListUploadData,
            error: this.handleErrorFxn,
        });
    }

    /** Download the original or failed price list upload files */
    actionToDownloadFile(context: 'original_file' | 'failed_upload_file_url') {
        if (!this.uploadedDataInfo) {
            console.warn(
                'actionToDownloadFile - No uploaded data info available'
            );
            return;
        }
        const fileUrl =
            context === 'original_file'
                ? this.uploadedDataInfo.upload_file_url
                : this.uploadedDataInfo.failed_upload_file_url;
        if (!fileUrl) {
            console.warn('actionToDownloadFile - File URL is undefined');
            return;
        }
        const a = document.createElement('a');
        a.href = fileUrl;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
}
