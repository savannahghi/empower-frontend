import { Injectable } from '@angular/core';
import { SilStoresService } from '../sil-http-services/sil_datalayer.service';
import { catchError, timeout, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ListComponentService {
    constructor(public dataLayer: SilStoresService) {}

    /**
     * should patch the record
     * */
    apiCall(conf, comp) {
        comp.loading[conf.loadingState] = true;
        this.dataLayer[conf.httpMethod](conf.api)
            /**
             * returns an error if a value is not emmitted within a given time
             */
            .pipe(
                timeout(60000),
                catchError(() => throwError(() => conf.failedMessage))
            )
            .subscribe({
                next: data => {
                    comp.loading[conf.loadingState] = false;
                    if (conf.dataMessage) {
                        const message = data[conf.dataMessage];
                        comp.showToast(
                            'bottom-right',
                            'success',
                            conf.dataTitle,
                            message
                        );
                    } else {
                        comp.showToast(
                            'bottom-right',
                            'success',
                            conf.successTitle,
                            conf.successMessage
                        );
                    }
                    comp.siltable.getData();
                },
                error: err => {
                    comp.loading[conf.loadingState] = false;
                    comp.errorHandler.handleError(err, comp);
                    comp.showToast(
                        'bottom-right',
                        'danger',
                        conf.failedTitle,
                        conf.failedMessage
                    );
                },
            });
    }
}
