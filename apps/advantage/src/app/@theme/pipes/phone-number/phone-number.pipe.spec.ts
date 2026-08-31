import { PhoneNumberPipe } from './phone-number.pipe';

describe('PhoneNumberPipe', () => {
    it('should return a formatted phone number', () => {
        const pipe = new PhoneNumberPipe();
        let res = pipe.transform('+254790360360');
        expect(res).toBe('+254 790 360 360');
        res = pipe.transform('254790360360');
        expect(res).toBe('+254 790 360 360');
    });

    it('should return an empty string if phone number is undefined', () => {
        const pipe = new PhoneNumberPipe();
        const res = pipe.transform(undefined);
        expect(res).toBe('');
    });
});
