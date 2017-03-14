import { ComponentFactoryResolver, ViewContainerRef, ComponentRef, Inject } from '@angular/core';
import { ModalDialogComponent } from './modal-dialog.component';
import { IModalDialogOptions } from './modal-dialog.interface';

export class ModalDialogService {
    private componentRef: ComponentRef<ModalDialogComponent>;

    /**
     * CTOR
     * @param componentFactoryResolver
     */
    constructor(@Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver) {}

    /**
     * Open dialog in given target element with given options
     * @param  {ViewContainerRef} target
     * @param  {IModalDialogOptions} dialogOptions?
     */
    openDialog(target: ViewContainerRef, dialogOptions?: IModalDialogOptions) {
        if (this.componentRef) {
            this.componentRef.destroy();
        }

        let factory = this.componentFactoryResolver.resolveComponentFactory(ModalDialogComponent);
        this.componentRef = target.createComponent(factory);
        this.componentRef.instance.dialogInit(this.componentRef, dialogOptions);
    }
}
