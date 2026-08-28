import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to return masked phone number, masking 5 number characters
 */
@Pipe({ name: 'maskPhoneNumberPipe', standalone: true })
export class MaskPhoneNumberPipe implements PipeTransform {
    transform(input: string): string {
        // Check if the phone number is valid (contains at least 10 digits)
        if (input.length < 10) {
            return 'Invalid phone number';
        }

        // Extract the first five digits
        const firstFive = input.substring(0, 5);

        // Extract the last three digits
        const lastThree = input.substring(input.length - 3);

        // Replace the middle digits with asterisks, after 5 digits and before the last 3 digits
        const maskedMiddle = input
            .substring(5, input.length - 3)
            .replace(/\d/g, '*');

        // Concatenate the masked parts - it retunrns in this format +2547*******123
        return firstFive + maskedMiddle + lastThree;
    }
}
