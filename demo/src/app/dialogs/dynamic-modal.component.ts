import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Component, ComponentRef } from '@angular/core';

@Component({
  selector: 'app-dynamic-modal',
  template: `
    <p>This component has dynamic buttons</p>
    <p>You can add and change action buttons "on fly"</p>
  `,
  styles: [':host { border: 1px solid lightgray; display: block; padding: 5px } ']
})
export class DynamicModalComponent implements IModalDialog {
  private internalActionButtons = [];

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<string>>) {
    options.actionButtons = this.internalActionButtons;

    this.internalActionButtons.push({
      text: 'Add new button',
      buttonClass: 'btn btn-info',
      onAction: () => this.addNewActionButton()
    });

    this.internalActionButtons.push({
      text: 'Close',
      buttonClass: 'btn btn-success',
      onAction: () => true
    });
  }

  addNewActionButton() {
    this.internalActionButtons.splice(1, 0, {
      text: 'Rename close button',
      buttonClass: 'btn btn-danger',
      onAction: () => this.renameCloseButton()
    });
  }

  renameCloseButton() {
    this.internalActionButtons[this.internalActionButtons.length - 1].text = 'KLOUZ';
  }
}
