import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '../../../features/services/window.service';

@Injectable()
export class RedirectService {
    windowInstance;

    constructor(@Inject(WINDOW) window: Window) {
        this.windowInstance = window;
    }
    redirectTo(url: string) {
        this.windowInstance.location.replace(url);
    }
}
