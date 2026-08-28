import { VariantDisplayPipe } from './variant-display.pipe';

describe('VariantDisplayPipe', () => {
    it('create an instance', () => {
        const pipe = new VariantDisplayPipe();
        expect(pipe).toBeTruthy();
    });

    it('test variant display', () => {
        const pipe = new VariantDisplayPipe();
        let res = pipe.transform('default');
        expect(res).toBe('Slade360 Advantage');
        res = pipe.transform('empower');
        expect(res).toBe('Empower Clinic');
        res = pipe.transform('uzazisalama');
        expect(res).toBe('UzaziSalama');
        res = pipe.transform('accessafya');
        expect(res).toBe('Access Afya');
        res = pipe.transform('sha');
        expect(res).toBe('Social Health Authority');
        res = pipe.transform(undefined);
        expect(res).toBe('Slade360 Advantage');
    });
});
