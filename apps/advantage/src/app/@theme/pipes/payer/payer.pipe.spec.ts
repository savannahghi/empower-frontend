import { PayerNamePipe } from './payer.pipe';

describe('PayerNamePipe', () => {
    it('create an instance', () => {
        const pipe = new PayerNamePipe();
        let res = pipe.transform(457);
        expect(res).toBe('Jubilee Health Insurance Limited');
        res = pipe.transform(2001);
        expect(res).toBe('APA Insurance Company');
        res = pipe.transform(2020);
        expect(res).toBe('MINET Insurance Brokers Limited');
        res = pipe.transform(2011);
        expect(res).toBe('MADISON GENERAL INSURANCE KENYA LTD');
        res = pipe.transform(2002);
        expect(res).toBe('BRITAM General Insurance');
        res = pipe.transform(2022);
        expect(res).toBe('GNRSH Insurance Scheme');
        res = pipe.transform(2023);
        expect(res).toBe('Savannah Informatics Insurance Scheme');
        const result = pipe.transform(2021);
        expect(result).toBe('2021');
    });
});
