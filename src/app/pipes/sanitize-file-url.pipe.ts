import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Pipe({
  name: 'sanitizeFileUrl',
  standalone: false
})
export class SanitizeFileUrlPipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  transform(value: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(window.location.origin + '/api/media/file/' + value); 
  }

}
