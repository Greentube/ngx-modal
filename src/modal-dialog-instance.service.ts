import { ComponentRef } from '@angular/core';
import { ModalDialogComponent } from './modal-dialog.component';

export class ModalDialogInstanceService {
  /**
   * Used to make sure there is exactly one instance of Modal Dialog
   */
  private componentRef: ComponentRef<ModalDialogComponent>;

  /**
   * Closes existing modal dialog
   */
  closeAnyExistingModalDialog() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  /**
   * Save component ref for future comparison
   * @param componentRef
   */
  saveExistingModalDialog(componentRef: ComponentRef<ModalDialogComponent>) {
    this.componentRef = componentRef;
  }
}
