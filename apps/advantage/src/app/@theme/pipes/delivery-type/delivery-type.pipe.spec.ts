import { DeliveryTypePipe } from './delivery-type.pipe';

describe('DeliveryTypePipe', () => {
    it('create an instance', () => {
        const pipe = new DeliveryTypePipe();
        expect(pipe).toBeTruthy();
    });

    it('test formatting', () => {
        const pipe = new DeliveryTypePipe();
        let res = pipe.transform('SCHEDULED_RECURRENT');
        expect(res).toBe('Scheduled Recurrent');
        res = pipe.transform('SCHEDULED_ONE_TIME');
        expect(res).toBe('Scheduled One Time');
        res = pipe.transform('INSTANT');
        expect(res).toBe('Instant Message');
        res = pipe.transform('OCCASIONAL');
        expect(res).toBe('OCCASIONAL');
    });
});
