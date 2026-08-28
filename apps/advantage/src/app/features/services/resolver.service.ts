import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorHandlerService } from '../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../shared/sil-http-services/sil_datalayer.service';

@Injectable({
    providedIn: 'root',
})
export class ResolverService {
    constructor(
        public dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService
    ) {}

    resolveItem(store, id, params): Observable<any> {
        return this.dataLayer.get(store, id, params);
    }
    resolveList(store, params): Observable<any> {
        return this.dataLayer.list(store, params);
    }
    resolvePostItem(store, view, id, obj): Observable<any> {
        return this.dataLayer.createNested(store, view, id, obj);
    }
}
