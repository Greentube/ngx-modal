import { Component, ComponentRef, HostBinding } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from './modal-dialog.interface';

export interface ISimpleModalDataOptions {
  text: string;
}

@Component({
  selector: 'simple-modal-dialog',
  template: ``,
  styles: [':host { display: block; }']
})
export class SimpleModalComponent implements IModalDialog {
    @HostBinding('innerHTML') text: string;

  /**
   * Initialize dialog with simple HTML content
   * @param {ComponentRef<IModalDialog>} reference
   * @param {Partial<IModalDialogOptions>} options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<ISimpleModalDataOptions>>) {
    if (!options.data) {
      throw new Error(`Data information for simple modal dialog is missing`);
    }
    this.text = options.data.text;
  }
}
