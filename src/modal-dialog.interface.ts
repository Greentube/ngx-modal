import { ComponentRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface IModalDialog {
  dialogInit: (reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) => void;
}

export interface IModalDialogOptions<T> {
  title: string;
  childComponent: any;
  onClose: () => Promise<any> | Observable<any> | boolean;
  actionButtons: IModalDialogButton[];
  data: T;
  placeOnTop: boolean;
  settings: Partial<IModalDialogSettings>;
  closeDialogSubject: Subject<void>;
}

export type ModalDialogOnAction = () => Promise<any> | Observable<any> | boolean | void;

export interface IModalDialogButton {
  text: string;
  buttonClass?: string;
  onAction?: ModalDialogOnAction;
  disabled?: boolean;
}

export interface IModalDialogSettings {
  overlayClass: string;
  overlayAnimationTriggerClass: string;
  modalClass: string;
  modalAnimationTriggerClass: string;
  modalDialogClass: string;
  contentClass: string;
  headerClass: string;
  headerTitleClass: string;
  closeButtonClass: string;
  closeButtonTitle: string;

  bodyClass: string;
  footerClass: string;
  alertClass: string;
  alertDuration: number;
  buttonClass: string;
  notifyWithAlert: boolean;
}
