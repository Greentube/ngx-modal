import { Component, ComponentRef }           from '@angular/core';
import { IModalDialog, IModalDialogOptions }  from './modal-dialog.interface';

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

  dialogInit(reference: ComponentRef<IModalDialog>, options?: IModalDialogOptions) {
    if (!options || !options.data) {
      throw new Error(`Data information for simple modal dialog is missing`);
    }
    this.text = options.data.text;
  }
}
