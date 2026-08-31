import { Injectable } from '@angular/core';
import { catchError, map, Subject, throwError } from 'rxjs';
import { SilStoresService } from '../sil-http-services/sil_datalayer.service';
import { Observable } from '@apollo/client/utilities';

@Injectable()
export class DetailComponentService {
    /** Used to store visit information */
    record: {};
    /** Emits visit information */
    recordDataEmitter: Subject<any>;
    constructor(public dataLayer: SilStoresService) {
        this.recordDataEmitter = new Subject();
    }
    /** Used to set the detail data in context */
    setRecordData(record) {
        this.record = record;
        this.recordDataEmitter.next(record);
    }

    /**
     * update a segment message Observable
     * @param data payload
     * @param templateId string
     * @returns response or error
     */
    patchMessageSegment(data, templateId): Observable<any> {
        return this.dataLayer
            .update('segment-templates', templateId, data)
            .pipe(
                map(response => ({ response })),
                catchError(error => {
                    return throwError(() => error);
                })
            ) as unknown as Observable<any>;
    }
}
