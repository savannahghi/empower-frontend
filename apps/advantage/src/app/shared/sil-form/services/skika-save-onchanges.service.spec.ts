import { SkikaSaveOnChangesService } from './skika-save-onchanges.service';
import { TestBed } from '@angular/core/testing';

describe('SkikaSaveOnChangesService', () => {
    let service: SkikaSaveOnChangesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SkikaSaveOnChangesService],
        });
        service = TestBed.inject(SkikaSaveOnChangesService);
    });

    it('should test receiveCurrentValue method', () => {
        spyOn(service, 'receiveCurrentValue').and.callThrough();
        const val = 'Value';
        service.receiveCurrentValue(val);
        expect(service.receiveCurrentValue).toHaveBeenCalledWith(val);
    });
});
