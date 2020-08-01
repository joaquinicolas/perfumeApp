import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform {

  transform(value: number, ...args: number[]): string {
    const ret = Math.floor(value);
    return ret.toFixed(2);
  }

}
