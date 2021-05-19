import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, maxChars: number): string {
    return value.length > maxChars
      ? value.substring(0, maxChars - 1) + '...'
      : value;
  }
}
