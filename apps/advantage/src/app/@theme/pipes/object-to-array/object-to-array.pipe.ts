import { Pipe, PipeTransform } from '@angular/core';
interface PatientTimelineInterface {
    date?: string | Date;
    Observation?: DetailsInterface[];
    Exam?: DetailsInterface[];
    Laboratory?: DetailsInterface[];
    Condition?: DetailedDetailsInterface[];
    AllergyIntolerance?: DetailedDetailsInterface[];
    RiskAssessment?: DetailsInterface[];
}

interface DetailsInterface {
    name: string;
    value: string;
}

interface DetailedDetailsInterface extends DetailsInterface {
    status: string;
}

@Pipe({
    name: 'objectToArray',
    standalone: false,
})
export class ObjectToArrayPipe implements PipeTransform {
    // The object parameter represents the values of the properties or index.
    transform = (objects: any): PatientTimelineInterface[] | any[] => {
        return Object.values(objects);
    };
}
