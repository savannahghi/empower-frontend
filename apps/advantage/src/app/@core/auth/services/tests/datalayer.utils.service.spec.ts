import { TestBed } from '@angular/core/testing';

import { DataLayerUtils } from '../datalayer.utils.service';

describe('DataLayerUtils service', () => {
    let utilsServices: DataLayerUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DataLayerUtils],
        });
        utilsServices = TestBed.inject(DataLayerUtils);
    });

    it('should makeQueryParams should construct url params', () => {
        const params = [
            { input: { a: 'b', b: 'c' }, output: 'a=b&b=c' },
            { input: {}, output: '' },
            { input: { simple: 'pair' }, output: 'simple=pair' },
            { input: { first: '1', second: '2' }, output: 'first=1&second=2' },
            {
                input: { 'escaped key': 'escaped value' },
                output: 'escaped%20key=escaped%20value',
            },
            { input: { emptyKey: '' }, output: 'emptyKey=' },
            {
                input: { flag1: true, key: 'value', flag2: true },
                output: 'flag1&key=value&flag2',
            },
            {
                input: { key: [323, 'value', true] },
                output: 'key=323&key=value&key',
            },
            {
                input: { key: [323, 'value', true, 1234] },
                output: 'key=323&key=value&key&key=1234',
            },
        ];
        params.forEach(p => {
            expect(utilsServices.makeQueryParams(p.input)).toEqual(p.output);
        });
    });

    it('should urlJoin should return a joined url string', () => {
        const prObj = [
            {
                input: ['http://localhost:9000', '/accounts/'],
                output: 'http://localhost:9000/accounts/',
            },
            {
                input: ['http://localhost:9000', undefined],
                output: 'http://localhost:9000/',
            },
            {
                input: ['http://localhost:9000', null],
                output: 'http://localhost:9000/',
            },
            {
                input: [undefined, null],
                output: '',
            },
            {
                input: ['/accounts', '/users'],
                output: '/accounts/users/',
            },
        ];
        prObj.forEach(p => {
            expect(utilsServices.urlJoin(...p.input)).toEqual(p.output);
        });
    });
});
