import { gradeConcepts, behaviourConcepts, stageConcept } from './concepts';

describe('gradeConcepts', () => {
    it('should have 5 grade concepts', () => {
        expect(gradeConcepts.length).toBe(5);
    });

    it('should contain correct titles and values', () => {
        expect(gradeConcepts[0]).toEqual({
            title: 'Grade 1',
            value: { code: 'gradeI', display: 'Well Differentiated' },
        });
        expect(gradeConcepts[4]).toEqual({
            title: 'Not graded',
            value: { code: 'none', display: 'Not Graded' },
        });
    });

    it('should have unique codes', () => {
        const codes = gradeConcepts.map(g => g.value.code);
        const uniqueCodes = new Set(codes);
        expect(uniqueCodes.size).toBe(codes.length);
    });
});

describe('behaviourConcepts', () => {
    it('should have 6 behaviour concepts', () => {
        expect(behaviourConcepts.length).toBe(6);
    });

    it('should contain correct titles and values', () => {
        expect(behaviourConcepts[0]).toEqual({
            title: 'Benign',
            value: { code: 'benign', display: 'Benign' },
        });
        expect(behaviourConcepts[5]).toEqual({
            title: 'Other',
            value: { code: 'other', display: 'Other' },
        });
    });

    it('should have unique codes', () => {
        const codes = behaviourConcepts.map(b => b.value.code);
        const uniqueCodes = new Set(codes);
        expect(uniqueCodes.size).toBe(codes.length);
    });
});

describe('stageConcept', () => {
    it('should have 4 stage concepts', () => {
        expect(stageConcept.length).toBe(4);
    });

    it('should contain correct titles and values', () => {
        expect(stageConcept[0]).toEqual({
            title: 'Stage 1',
            value: { code: 'stage1', display: 'Stage 1' },
        });
        expect(stageConcept[3]).toEqual({
            title: 'Stage 4',
            value: { code: 'stage4', display: 'Stage 4' },
        });
    });

    it('should have unique codes', () => {
        const codes = stageConcept.map(s => s.value.code);
        const uniqueCodes = new Set(codes);
        expect(uniqueCodes.size).toBe(codes.length);
    });
});
