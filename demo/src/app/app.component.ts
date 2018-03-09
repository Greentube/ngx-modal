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
      title: 'Simple dialog',
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
      title: 'Dialog with delayed closing',
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
      title: 'Dialog with action buttons',
      childComponent: SimpleModalComponent,
      data: {
        text: 'Not so simple modal dialog. Do you agree?\n(It will close on Yes, fail on No and do nothing on Site effect)'
      },
      settings: {
        closeButtonClass: 'close theme-icon-close'
      },
      actionButtons: [
        {
          text: 'Yes, close me!',
          buttonClass: 'btn btn-success',
          onAction: () => new Promise((resolve: any) => {
            setTimeout(() => {
              resolve();
            }, 20);
          })
        },
        {
          text: 'Side effect',
          buttonClass: 'btn btn-info',
          onAction: () => {
            alert('As you can see, I will not close this dialog');
          }
        },
        {
          text: 'No, fail closing!',
          buttonClass: 'btn btn-danger',
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
      title: 'Custom child component',
      childComponent: CustomModalComponent,
      settings: {
        closeButtonClass: 'close theme-icon-close'
      },
      data: 'Hey, we are data passed from the parent!'
    });
  }
}
