import { Component, ViewContainerRef } from '@angular/core';
import { ModalDialogService, SimpleModalComponent } from 'ngx-modal-dialog';
import { CustomModalComponent } from './dialogs/custom-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private modalDialogService: ModalDialogService, private viewContainer: ViewContainerRef) {}

  openSimpleModal() {
    this.modalDialogService.openDialog(this.viewContainer, {
      title: 'Simple',
      childComponent: SimpleModalComponent,
      settings: {
        closeButtonClass: 'close theme-icon-close'
      },
      data: {
        text: 'Some text content'
      }
    });
  }

  openSimpleModalWithCallback() {
    this.modalDialogService.openDialog(this.viewContainer, {
      title: 'Simple',
      childComponent: SimpleModalComponent,
      data: {
        text: 'Some text content. It will close after 1 sec.'
      },
      settings: {
        closeButtonClass: 'close theme-icon-close'
      },
      onClose: () => new Promise((resolve: any) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      })
    });
  }

  openPromptModal() {
    this.modalDialogService.openDialog(this.viewContainer, {
      title: 'Simple',
      childComponent: SimpleModalComponent,
      data: {
        text: 'Not so simple modal dialog. Do you agree?\n(It will close on Fine but fail on close)'
      },
      settings: {
        closeButtonClass: 'close theme-icon-close'
      },
      actionButtons: [
        {
          text: 'Im fine, thanks',
          onAction: () => new Promise((resolve: any) => {
            setTimeout(() => {
              resolve();
            }, 20);
          })
        },
        {
          text: 'Brake, please',
          onAction: () => new Promise((resolve: any, reject: any) => {
            setTimeout(() => {
              reject();
            }, 20);
          })
        }
      ]
    });
  }

  openCustomModal() {
    this.modalDialogService.openDialog(this.viewContainer, {
      title: 'Custom',
      childComponent: CustomModalComponent,
      settings: {
        closeButtonClass: 'close theme-icon-close'
      },
      data: 'Hey, we are data passed from the parent!'
    });
  }
}
