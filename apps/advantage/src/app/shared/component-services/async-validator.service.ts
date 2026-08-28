import { Injectable } from '@angular/core';
import { ResolverService } from '../../features/services/resolver.service';
import { ErrorHandlerService } from '../sil-http-services/error-handler';

@Injectable({
    providedIn: 'root',
})
export class AsyncValidatorService {
    constructor(
        private resolverService: ResolverService,
        private errorHandler: ErrorHandlerService
    ) {}

    /**
     * Duplicate item validation for form with edit
     * @param store store service key
     * @param stateParamsID item ID if present in state
     * @param params store params
     */
    validateUniquenessEditMode({
        store,
        stateParamsID,
        params,
    }: {
        store: string;
        stateParamsID: string;
        params: Record<string, string>;
    }) {
        return new Promise(resolve => {
            this.resolverService.resolveList(store, params).subscribe({
                next: (response: any) => {
                    // If response item is the same as the one being edited
                    if (stateParamsID === response.results[0]?.id) {
                        resolve({ uniqueItem: true });
                    }
                    // If item appears more than once in the list
                    else if (response?.results?.length > 0) {
                        resolve(null);
                    } else {
                        resolve({ uniqueItem: true });
                    }
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                },
            });
        });
    }
}
