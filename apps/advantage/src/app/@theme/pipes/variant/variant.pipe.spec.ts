import { environment } from '../../../../environments/environment';
import { VariantPipe } from './variant.pipe';

describe('VariantPipe', () => {
    it('create an instance', () => {
        const pipe = new VariantPipe();
        environment.variant = 'empower';
        let result = pipe.transform('empower');
        /** expect it to pass as true empower === empower */
        expect(result).toBe(true);
        result = pipe.transform('!empower');
        /** expect it to pass as false empower !== empower */
        expect(result).toBe(false);
        /** expect it to pass as false default === empower */
        result = pipe.transform('default');
        expect(result).toBe(false);
        result = pipe.transform('');
        expect(result).toBe(false);
        result = pipe.transform(null);
        expect(result).toBe(false);
        result = pipe.transform(false);
        expect(result).toBe(false);
        /** expect it to pass as true default === empower */
        result = pipe.transform('default:uzazisalama');
        expect(result).toBe(true);
        expect(function () {
            pipe.transform('empower;default:uzazisalama');
        }).toThrowError('You can only use one type of action splitter');
        result = pipe.transform('empower;default');
        expect(result).toBe(true);
        result = pipe.transform('empower:default');
        expect(result).toBe(true);
    });

    it('should convert non-string, non-boolean values to string', () => {
        const pipe = new VariantPipe();
        environment.variant = 'empower';

        let result = pipe.transform(123);
        expect(result).toBe(false);

        result = pipe.transform({ test: 'value' });
        expect(result).toBe(false);

        result = pipe.transform(['test']);
        expect(result).toBe(false);
    });
});
