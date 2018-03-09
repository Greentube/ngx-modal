import { ComponentFactoryResolver, ViewContainerRef, Inject } from '@angular/core';
import { ModalDialogComponent } from './modal-dialog.component';
import { IModalDialogOptions } from './modal-dialog.interface';
import { ModalDialogInstanceService } from './modal-dialog-instance.service';

export class ModalDialogService {
  /**
   * CTOR
   * @param componentFactoryResolver
   * @param modalDialogInstanceService
   */
  constructor(@Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver,
              @Inject(ModalDialogInstanceService) private modalDialogInstanceService: ModalDialogInstanceService) {
  }

  /**
   * Open dialog in given target element with given options
   * @param  {ViewContainerRef} target
   * @param  {IModalDialogOptions} options?
   */
  openDialog(target: ViewContainerRef, options: Partial<IModalDialogOptions<any>> = {}) {
    this.modalDialogInstanceService.closeAnyExistingModalDialog();

    const factory = this.componentFactoryResolver.resolveComponentFactory(ModalDialogComponent);
    const componentRef = target.createComponent(factory);
    componentRef.instance.dialogInit(componentRef, options);

    this.modalDialogInstanceService.saveExistingModalDialog(componentRef);
  }
}
