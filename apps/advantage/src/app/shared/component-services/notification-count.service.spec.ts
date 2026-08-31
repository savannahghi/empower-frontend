import { NotificationService } from './notification-count.service';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('NotificationService', () => {
    let service: NotificationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [RouterTestingModule],
            providers: [
                NotificationService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });
    beforeEach(() => {
        service = TestBed.inject(NotificationService);
    });

    it('should test updateNotificationCount method', () => {
        spyOn(service, 'updateNotificationCount').and.callThrough();
        service.updateNotificationCount('12');
        expect(service.updateNotificationCount).toHaveBeenCalledWith('12');
    });
});
