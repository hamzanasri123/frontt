import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'propreties'
})
export class PropretiesPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {

    if (!value) {
      return [];
    }
    return Object.keys(value);
  }

}
