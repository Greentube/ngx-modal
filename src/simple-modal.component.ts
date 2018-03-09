import { Component, ComponentRef } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from './modal-dialog.interface';

export interface ISimpleModalDataOptions {
  text: string;
}

@Component({
  selector: 'simple-modal-dialog',
  template: ``,
  styles: [':host { display: block; }'],
  host: {
    '[innerHTML]': 'text'
  }
})
export class SimpleModalComponent implements IModalDialog {
  text: string;

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
