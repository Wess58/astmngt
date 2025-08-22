import { Directive, HostListener, Input, ElementRef } from '@angular/core';

@Directive({
  selector: 'img[imageFallback]' ,
  standalone: false
})
export class ImageFallbackDirective {
  @Input() appImageFallback: string = 'assets/images/no-image.png';

  constructor(private el: ElementRef<HTMLImageElement>) { }

  @HostListener('error')
  onError() {
    const img = this.el.nativeElement;
    if (img.src !== this.appImageFallback) {
      img.src = this.appImageFallback;
    }
  }
}



