import {Component, ViewContainerRef} from '@angular/core';
import {ModalDialogService, SimpleModalComponent} from 'ngx-modal-dialog';
import {CustomModalComponent} from './dialogs/custom-modal.component';
import {DynamicModalComponent} from './dialogs/dynamic-modal.component';
import {CustomHeaderModalComponent} from './dialogs/custom-header-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private modalDialogService: ModalDialogService, private viewContainer: ViewContainerRef) {
  }

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

  openCustomHeaderModal() {
    this.modalDialogService.openDialog(this.viewContainer, {
      title: 'Custom child component',
      headerComponent: CustomHeaderModalComponent,
      childComponent: CustomModalComponent,
      settings: {
        closeButtonClass: 'close theme-icon-close'
      },
      data: 'Yahima Duarte <layahi@gmail.com>'
    });
  }

  openDynamicModal() {
    this.modalDialogService.openDialog(this.viewContainer, {
      title: 'Dynamic child component',
      childComponent: DynamicModalComponent,
      settings: {
        closeButtonClass: 'close theme-icon-close'
      }
    });
  }

  openMultipleModal() {
    this.modalDialogService.openDialog(this.viewContainer, {
      title: 'Dialog 1',
      childComponent: SimpleModalComponent,
      settings: {closeButtonClass: 'close theme-icon-close'},
      placeOnTop: true,
      data: {
        text: `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
      }
    });
    this.modalDialogService.openDialog(this.viewContainer, {
      title: 'Dialog 2',
      childComponent: SimpleModalComponent,
      settings: {closeButtonClass: 'close theme-icon-close'},
      placeOnTop: true,
      data: {
        text: `
        Lorem ipsum is placeholder text commonly used in the graphic, print,
        and publishing industries for previewing layouts and visual mockups.`
      }
    });
    this.modalDialogService.openDialog(this.viewContainer, {
      title: 'Dialog 3',
      childComponent: SimpleModalComponent,
      settings: {closeButtonClass: 'close theme-icon-close'},
      placeOnTop: true,
      data: {text: 'Some text content'}
    });
  }
}
