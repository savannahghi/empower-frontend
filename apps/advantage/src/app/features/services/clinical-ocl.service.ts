import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SilStoresService } from '../../shared/sil-http-services/sil_datalayer.service';

export interface Condition {
    uuid: string;
    id: boolean;
    display_name: string;
    source: string;
}

@Injectable({
    providedIn: 'root',
})
export class GetConditionListFromOcl {
    constructor(public dataLayer: SilStoresService) {}

    /**
     * responseFunction
     * Returns the results from conditions api
     */
    responseFunction = resp => {
        function selectFewerFields(select) {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { uuid, id, display_name, source } = select;
            return { uuid, id, display_name, source };
        }
        const newArr = resp.map(selectFewerFields);
        return newArr;
    };

    /**
     *  getCondition
     * Gets the conditions from the api
     */
    getCondition(term): Observable<Condition[]> {
        const params = {
            q: term,
            exact_match: 'off',
            source: 'ciel, icd-10',
            conceptClass: 'diagnosis',
        };

        return this.dataLayer
            .list('diagnosis', params)
            .pipe(map(this.responseFunction));
    }
}
