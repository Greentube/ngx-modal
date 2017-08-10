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
   * @param  {IModalDialogOptions} dialogOptions?
   */
  openDialog(target: ViewContainerRef, dialogOptions?: IModalDialogOptions) {
    this.modalDialogInstanceService.closeAnyExistingModalDialog();

    const factory = this.componentFactoryResolver.resolveComponentFactory(ModalDialogComponent);
    const componentRef = target.createComponent(factory);
    componentRef.instance.dialogInit(componentRef, dialogOptions);

    this.modalDialogInstanceService.saveExistingModalDialog(componentRef);
  }
}
