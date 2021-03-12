import {ComponentRef} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ModalDialogHeaderType} from './modal-dialog.header-type';

export interface IModalDialog {
  dialogInit: (reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) => void;
}

export interface IModalHeaderDialog {
  setData(data: any): void;
}

export interface IModalDialogOptions<T> {
  title: string;
  headerComponent: any;
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
  headerType: ModalDialogHeaderType;
}
