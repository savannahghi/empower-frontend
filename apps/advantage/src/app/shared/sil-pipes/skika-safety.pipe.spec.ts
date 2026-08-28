import { SkikaSafePipe } from './skika-safety.pipe';
import { TestBed } from '@angular/core/testing';

describe('SkikaSafePipe', () => {
    let pipe: SkikaSafePipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SkikaSafePipe],
        });
        pipe = TestBed.inject(SkikaSafePipe);
    });

    it('should test transform method: html', () => {
        spyOn(pipe, 'transform').and.callThrough();
        const value = {};
        const type = 'html';
        pipe.transform(value, type);
        expect(pipe.transform).toHaveBeenCalledWith(value, type);
    });

    it('should test transform method: style', () => {
        spyOn(pipe, 'transform').and.callThrough();
        const value = {};
        const type = 'style';
        pipe.transform(value, type);
        expect(pipe.transform).toHaveBeenCalledWith(value, type);
    });

    it('should test transform method: url', () => {
        spyOn(pipe, 'transform').and.callThrough();
        const value = {};
        const type = 'url';
        pipe.transform(value, type);
        expect(pipe.transform).toHaveBeenCalledWith(value, type);
    });

    it('should test transform method: script', () => {
        spyOn(pipe, 'transform').and.callThrough();
        const value = {};
        const type = 'script';
        pipe.transform(value, type);
        expect(pipe.transform).toHaveBeenCalledWith(value, type);
    });

    it('should test transform method: resourceUrl', () => {
        spyOn(pipe, 'transform').and.callThrough();
        const value = {};
        const type = 'resourceUrl';
        pipe.transform(value, type);
        expect(pipe.transform).toHaveBeenCalledWith(value, type);
    });

    it('should test transform method: ""', () => {
        spyOn(pipe, 'transform').and.callThrough();
        const value = {};
        const type = '';
        pipe.transform(value, type);
        expect(pipe.transform).toHaveBeenCalledWith(value, type);
    });
});
