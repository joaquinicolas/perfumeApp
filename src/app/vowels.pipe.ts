import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'vowels'
})
export class VowelsPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    const vowels = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'];
    vowels.forEach(v => {
      const re = new RegExp(v, 'g');
      value = value.replace(re, v.charCodeAt(0).toString());
    });

    return value;
  }

}
