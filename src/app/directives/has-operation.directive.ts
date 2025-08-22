import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';

@Directive({
  selector: '[hasOperation]',
  standalone: false
})
export class HasOperationDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
  ) { }

  user: any = {};
  referenceOperation: string[] = [];

  @Input()
  set hasOperation(value: string | string[]) {

    this.user = JSON.parse(sessionStorage.getItem('astuser') ?? '{}');

    if (Array.isArray(value)) {
      value.forEach((operation) => {

        this.referenceOperation.push(operation);
      })
    } else {
      this.referenceOperation.push(value);
    }

    this.updateView();



  }

  private updateView(): void {
    let hasOperation = false;

    this.referenceOperation.forEach((operation) => {
      if (this.user?.operations?.includes(operation)) {
        hasOperation = true;
      }
    });

    this.viewContainerRef.clear();

    if (hasOperation) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
