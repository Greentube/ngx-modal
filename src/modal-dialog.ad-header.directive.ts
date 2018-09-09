import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ad-header]',
})
export class AdHeaderDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
