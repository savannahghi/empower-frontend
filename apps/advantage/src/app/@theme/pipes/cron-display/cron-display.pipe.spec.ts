import { CronDisplayPipe } from './cron-display.pipe';

describe('CronDisplayPipe', () => {
    it('create an instance', () => {
        const pipe = new CronDisplayPipe();
        const res = pipe.transform('15 11 * * WED');
        expect(pipe).toBeTruthy();
        expect(res).toBe('At 11:15 AM, only on Wednesday');
    });
});
