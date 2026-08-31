import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        readonly auth: AuthenticationService,
        private readonly router: Router
    ) {
        // code...
    }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        if (this.auth.isAuthenticated()) {
            return true;
        } else {
            void this.router.navigate(['/auth/login']);

            return false;
        }
    }
}
