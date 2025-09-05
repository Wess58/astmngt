import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCommasFormat]',
  standalone: false

})
export class InputCommaFormatDirective {
  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  // @HostListener('ngModelChange', ['$event'])
  // onModelChange(value: any): void {
  //   this.el.value = this.formatNumber(String(value).replace(/,/g, ''));
  // }


  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    let value = String(this.el.value);

    // remove all non-digit chars (like commas)
    const numericValue = value.replace(/,/g, '');

    if (!numericValue) {
      this.el.value = '';
      return;
    }

    // format with commas
    this.el.value = this.formatNumber(numericValue);
  }

  // ngAfterViewInit(): void {
  //   if (this.el.value) {
  //     this.el.value = this.formatNumber(this.el.value.replace(/,/g, ''));
  //   }
  // }

  private formatNumber(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
