import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'skika-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: false,
})
export class SkikaRegisterComponent {
    redirectDelay: number = 300;
    showMessages: any = {};
    strategy: string = 'email';

    submitted = false;
    errors: string[] = [];
    error: any;
    user: any = {};
    options: any;
    cd: any;
    router: Router;

    constructor(protected _cd: ChangeDetectorRef, protected _router: Router) {
        this.cd = _cd;
        this.router = _router;
        this.redirectDelay = this.getConfigValue(
            'forms.register.redirectDelay'
        );
        this.showMessages = this.getConfigValue('forms.register.showMessages');
        this.strategy = this.getConfigValue('forms.register.strategy');
    } /* istanbul ignore next */

    goToLogin(redirect) {
        setTimeout(() => {
            this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
    }

    goToVerify(redirect) {
        const paramObj = { verify_email: this.user.email };
        setTimeout(() => {
            this.router.navigate([redirect], { queryParams: paramObj });
        }, this.redirectDelay);
    }

    register(): void {
        this.submitted = true;
    }

    receiveModel(model) {
        this.user = model;
        this.register();
    }

    getConfigValue(key: string): any {
        return key;
    }
}
