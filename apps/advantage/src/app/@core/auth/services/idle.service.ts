import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class IdleService {
    private userLoggedIn = new Subject<boolean>();
    setLogin: boolean = false;

    constructor() {
        this.userLoggedIn.next(false);
    }

    setUserLoggedIn(userLoggedIn: boolean) {
        this.userLoggedIn.next(userLoggedIn);
    }

    getUserLoggedIn(): Observable<boolean> {
        return this.userLoggedIn.asObservable();
    }
}
