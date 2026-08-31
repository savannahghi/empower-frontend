import { IdleService } from './idle.service';
import { TestBed } from '@angular/core/testing';

describe('IdleService', () => {
    let service: IdleService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(IdleService);
    });

    it('should test getUserLoggedIn method', () => {
        service.getUserLoggedIn();
        expect(service.getUserLoggedIn).toBeDefined();
    });
});
