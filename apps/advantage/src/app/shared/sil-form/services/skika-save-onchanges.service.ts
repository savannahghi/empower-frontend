import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SkikaSaveOnChangesService {
    // observable sources
    newValue = new Subject<any>();
    currentValue = new Subject<any>();

    // observable streams
    newValue$ = this.newValue.asObservable();
    currentValue$ = this.currentValue.asObservable();

    setNewValue(val) {
        this.newValue.next(val);
    }

    receiveCurrentValue(val) {
        this.currentValue.next(val);
    }
}
