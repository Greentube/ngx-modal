import { ComponentRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export interface IModalDialog {
  dialogInit: (reference: ComponentRef<IModalDialog>, options?: IModalDialogOptions) => void ;
}

export interface IModalDialogOptions {
  title?: string;
  childComponent?: any;
  onClose?: () => Promise<any> | Observable<any> | boolean;
  actionButtons?: IModalDialogButton[];
  data?: any;
  settings?: IModalDialogSettings;
}

export interface IModalDialogButton {
  text: string;
  buttonClass?: string;
  onAction?: () => Promise<any> | Observable<any> | boolean;
}

export interface IModalDialogSettings {
  overlayClass?: string;
  modalClass?: string;
  contentClass?: string;
  headerClass?: string;
  bodyClass?: string;
  footerClass?: string;
  alertClass?: string;
  alertDuration?: number;
  buttonsClass?: string;
  notifyWithAlert?: boolean;
}

