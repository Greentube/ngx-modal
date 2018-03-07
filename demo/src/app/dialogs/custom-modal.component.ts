import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Component, ComponentRef } from '@angular/core';

@Component({
  selector: 'app-custom-modal',
  template: `
    <p>This component is custom.</p>
    <p>This came from parent: <b>{{parentInfo}}</b></p>
  `
})
export class CustomModalComponent implements IModalDialog {
  parentInfo: string;

  dialogInit(reference: ComponentRef<IModalDialog>, options?: IModalDialogOptions) {
    this.parentInfo = options.data;
  }
}
