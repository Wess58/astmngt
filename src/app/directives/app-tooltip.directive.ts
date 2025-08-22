import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: false
})
export class AppTooltipDirective implements OnChanges,OnDestroy {

  // ATTRIBUTES ON HTML ELEMENT
  // appTooltip = "I’m a tooltip" tooltipTrigger = "click" tooltipDelay = "200" tooltipPosition = "right"

  @Input('appTooltip') tooltipText = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() tooltipDelay: number = 0; // ms
  @Input() tooltipTrigger: 'hover' | 'click' = 'hover'; //  trigger type
  @Input() disableOnTouchDevice: boolean = false;

  private tooltipEl?: HTMLElement;
  private delayTimeout?: ReturnType<typeof setTimeout>;
  private isTooltipVisible = false;

  constructor(private el: ElementRef, private renderer: Renderer2) { }


  ngOnChanges(changes: SimpleChanges): void {
    // If tooltip is already visible, update its text
    if (changes['tooltipText'] && this.tooltipEl) {
      this.tooltipEl.innerHTML = this.tooltipText;
    }
  }


  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.tooltipTrigger === 'hover') {
      this.delayTimeout = setTimeout(() => this.showTooltip(), this.tooltipDelay);
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.tooltipTrigger === 'hover') {
      if (this.delayTimeout) clearTimeout(this.delayTimeout);
      this.hideTooltip();
    }
  }

  @HostListener('click')
  onClick(): void {
    if (this.tooltipTrigger === 'click') {
      this.isTooltipVisible ? this.hideTooltip() : this.showTooltip();
      this.isTooltipVisible = !this.isTooltipVisible;
    }
  }

  private showTooltip(): void {
    if (this.tooltipEl || !this.tooltipText || window.innerWidth < 770) return;
    // this.disableOnTouchDevice && window.innerWidth < 770)

    const hostRect = this.el.nativeElement.getBoundingClientRect();

    this.tooltipEl = this.renderer.createElement('div');
    this.renderer.appendChild(
      this.tooltipEl,
      this.renderer.createText(this.tooltipText)
    );

    this.renderer.setStyle(this.tooltipEl, 'position', 'fixed');
    this.renderer.setStyle(this.tooltipEl, 'background', '#0009');
    this.renderer.setStyle(this.tooltipEl, 'color', '#fff');
    this.renderer.setStyle(this.tooltipEl, 'padding', '5px 10px');
    this.renderer.setStyle(this.tooltipEl, 'borderRadius', '4px');
    this.renderer.setStyle(this.tooltipEl, 'fontSize', '12px');
    this.renderer.setStyle(this.tooltipEl, 'zIndex', '9000');
    this.renderer.setStyle(this.tooltipEl, 'whiteSpace', 'nowrap');
    this.renderer.setStyle(this.tooltipEl, 'pointerEvents', 'none');
    this.renderer.setStyle(this.tooltipEl, 'transition', 'opacity 0.2s');
    this.renderer.setStyle(this.tooltipEl, 'opacity', '0');
    this.renderer.setStyle(this.tooltipEl, 'backdrop-filter', 'blur(7px)');


    this.renderer.appendChild(document.body, this.tooltipEl);

    // Position after appended to calculate size
    requestAnimationFrame(() => {
      if (!this.tooltipEl) return;

      const tooltipRect = this.tooltipEl.getBoundingClientRect();
      let top = 0, left = 0;

      switch (this.tooltipPosition) {
        case 'top':
          top = hostRect.top - tooltipRect.height - 8;
          left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = hostRect.bottom + 8;
          left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
          left = hostRect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
          left = hostRect.right + 8;
          break;
      }

      // Prevent overflow
      top = Math.max(4, Math.min(top, window.innerHeight - tooltipRect.height - 30));
      left = Math.max(4, Math.min(left, window.innerWidth - tooltipRect.width - 30));

      this.renderer.setStyle(this.tooltipEl, 'top', `${top}px`);
      this.renderer.setStyle(this.tooltipEl, 'left', `${left}px`);
      this.renderer.setStyle(this.tooltipEl, 'opacity', '1');
    });
  }

  private hideTooltip(): void {
    if (this.tooltipEl) {
      this.renderer.removeChild(document.body, this.tooltipEl);
      this.tooltipEl = undefined;
    }
  }

  ngOnDestroy(): void {
    this.hideTooltip();
    if (this.delayTimeout) clearTimeout(this.delayTimeout);
  }
}
