import { MaskPhoneNumberPipe } from './mask-phone-number.pipe';

describe('maskPhoneNumberPipe', () => {
    it('test maskPhoneNumberPipe masks phone number', () => {
        const pipe = new MaskPhoneNumberPipe();
        const res = pipe.transform('');
        expect(res).toBe('Invalid phone number');
        const result = pipe.transform('+254711111321');
        expect(result).toBe('+2547*****321');
    });
});
