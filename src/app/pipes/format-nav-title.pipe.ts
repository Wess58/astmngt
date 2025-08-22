import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNavTitle',
  standalone:false
})
export class FormatNavTitlePipe implements PipeTransform {

  transform(value: any): any {
    if (value) {
      const splitName: any = value.toLowerCase().split('_');
      splitName[0] = splitName[0]?.charAt(0).toUpperCase() + splitName[0]?.slice(1).toLowerCase();
      return splitName.join(" ");
    }
  }

}
