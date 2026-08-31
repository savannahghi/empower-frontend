import { StringReplacePipe } from './string-replace.pipe';

describe('StringReplacePipe', () => {
    it('create an instance', () => {
        const pipe = new StringReplacePipe();
        expect(pipe).toBeTruthy();
    });

    it('test string replacement', () => {
        const pipe = new StringReplacePipe();
        let res = pipe.transform('DELIVERED');
        expect(res).toBe('Delivered');
        res = pipe.transform('UNDELIVERED');
        expect(res).toBe('Undelivered');
        res = pipe.transform('SENT');
        expect(res).toBe('Pending');
        res = pipe.transform(undefined);
        expect(res).toBe('No Status');
        res = pipe.transform('DONT REPLACE');
        expect(res).toBe('DONT REPLACE');
    });
});
