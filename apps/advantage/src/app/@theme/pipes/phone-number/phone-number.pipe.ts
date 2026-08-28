import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to return formatted phone number
 */
@Pipe({
    name: 'phoneNumberPipe',
    standalone: false,
})
export class PhoneNumberPipe implements PipeTransform {
    transform(phoneNumber: string): string {
        // Check if phone number is undefined
        if (!phoneNumber) return '';
        // Check if the phone number starts with '+'
        if (phoneNumber?.startsWith('+')) {
            // Remove the first '+' only if it exists
            phoneNumber = phoneNumber.substring(1);
        }

        // Insert spaces every 3 characters starting from the third character
        let formatted = phoneNumber?.replace(
            /(\d{3})(\d{3})(\d{3})(\d{3})/,
            '$1 $2 $3 $4'
        );

        // Add back the '+' sign at the beginning if it was originally present
        if (!formatted?.startsWith('+')) {
            formatted = '+' + formatted;
        }

        return formatted;
    }
}
