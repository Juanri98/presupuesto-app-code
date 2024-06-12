import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCurrencyInput]',
})
export class CurrencyInputDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    let value = inputElement.value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');

    if (parts.length > 1) {
      const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      value = integerPart + '.' + parts[1];
    } else {
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    inputElement.value = value;
  }
}
