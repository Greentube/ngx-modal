import { ComponentRef } from '@angular/core';
import { ModalDialogComponent } from './modal-dialog.component';

export class ModalDialogInstanceService {
  /**
   * Used to make sure there is exactly one instance of Modal Dialog
   */
  private componentRefs: ComponentRef<ModalDialogComponent>[] = [];

  /**
   * Closes existing modal dialog
   */
  closeAnyExistingModalDialog() {
    while (this.componentRefs.length) {
      this.componentRefs[this.componentRefs.length - 1].destroy();
    }
  }

  /**
   * Save component ref for future comparison
   * @param componentRef
   */
  saveExistingModalDialog(componentRef: ComponentRef<ModalDialogComponent>) {
    // remove overlay from top element
    this.setOverlayForTopDialog(false);
    // add new component
    this.componentRefs = [...this.componentRefs, componentRef];
    componentRef.instance.showOverlay = true;

    componentRef.onDestroy(() => {
      this.componentRefs.pop();
      this.setOverlayForTopDialog(true);
    });
  }

  setOverlayForTopDialog(value: boolean) {
    if (this.componentRefs.length) {
      this.componentRefs[this.componentRefs.length - 1].instance.showOverlay = value;
    }
  }
}
