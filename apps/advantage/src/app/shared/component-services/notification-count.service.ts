import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private notificationCountSubject = new BehaviorSubject<string>('');
    notificationCount$ = this.notificationCountSubject.asObservable();

    // Update auto recon. notification count on the sidebar
    updateNotificationCount(data: any): void {
        this.notificationCountSubject.next(data);
    }
}
