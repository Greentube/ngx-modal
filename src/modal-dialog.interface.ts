import {ComponentRef} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

export interface IModalDialog {
    dialogInit: (reference: ComponentRef<IModalDialog>, options?: IModalDialogOptions) => void;
}

export interface IModalDialogOptions {
    title?: string;
    childComponent?: any;
    onClose?: () => Promise<any> | Observable<any> | boolean;
    actionButtons?: IModalDialogButton[];
    data?: any;
    settings?: IModalDialogSettings;
    closeDialogSubject?: Subject<void>;
}

export type ModalDialogOnAction = () => Promise<any> | Observable<any> | boolean | void;

export interface IModalDialogButton {
    text: string;
    buttonClass?: string;
    onAction?: ModalDialogOnAction;
}

export interface IModalDialogSettings {
    // overlayClass?: string;
    modalClass?: string;
    dialogClass?: string;
    contentClass?: string;
    headerClass?: string;
    headerTitleClass?: string;
    closeButtonClass?: string;
    closeButtonTitle?: string;

    bodyClass?: string;
    footerClass?: string;
    alertClass?: string;
    alertDuration?: number;
    buttonClass?: string;
    notifyWithAlert?: boolean;
}

