import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Component, ComponentRef } from '@angular/core';

@Component({
  selector: 'app-dynamic-modal',
  template: `
    <p>This component is custom.</p>
    <p>This came from parent: /p>
  `,
  styles: [':host { background: lightblue; display: block; padding: 5px } ']
})
export class DynamicModalComponent implements IModalDialog {
  private internalActionButtons = [];

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<string>>) {
    options.actionButtons = this.internalActionButtons;

    this.internalActionButtons.push({
      text: 'Add new button',
      buttonClass: 'btn',
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
      buttonClass: 'btn',
      onAction: () => this.renameCloseButton()
    });
  }

  renameCloseButton() {
    this.internalActionButtons[this.internalActionButtons.length - 1].text = 'KLOUZ';
  }
}
