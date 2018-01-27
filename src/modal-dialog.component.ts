﻿import {Component, ComponentFactoryResolver, ComponentRef, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {
    IModalDialog,
    IModalDialogButton,
    IModalDialogOptions,
    IModalDialogSettings,
    ModalDialogOnAction
} from './modal-dialog.interface';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import {Subject} from 'rxjs/Subject';

/**
 * Modal dialog component
 * Usage:
 *
 * Model properties are:
 *
 */
@Component({
    selector: 'modal-dialog',
    styles: [`
      @-moz-keyframes shake {
        from, to                { transform: translate3d(0, -50%, 0); }
        10%, 30%, 50%, 70%, 90% { transform: translate3d(-2rem, -50%, 0); }
        20%, 40%, 60%, 80%      { transform: translate3d(2rem, -50%, 0); }
      }
      @-webkit-keyframes shake {
        from, to                { transform: translate3d(0, -50%, 0); }
        10%, 30%, 50%, 70%, 90% { transform: translate3d(-2rem, -50%, 0); }
        20%, 40%, 60%, 80%      { transform: translate3d(2rem, -50%, 0); }
      }
      @keyframes shake {
        from, to                { transform: translate3d(0, -50%, 0); }
        10%, 30%, 50%, 70%, 90% { transform: translate3d(-2rem, -50%, 0); }
        20%, 40%, 60%, 80%      { transform: translate3d(2rem, -50%, 0); }
      }

      .default-modal {
        display: block;
        top: 50%;
        left: 50%;
        right: auto;
        bottom: auto;
        backface-visibility: hidden;
        overflow: visible;
      }
      .default-modal-content {
        left: -50%;
        transform: translateY(-50%);
      }
      .default-modal-content.shake {
        backface-visibility: hidden;
        -webkit-animation-duration: 0.5s;
        -moz-animation-duration: 0.5s;
        animation-duration: 0.5s;
        -webkit-animation-fill-mode: both;
        -moz-animation-fill-mode: both;
        animation-fill-mode: both;
        -webkit-animation-iteration-count: infinite;
        -moz-animation-iteration-count: infinite;
        animation-iteration-count: infinite;
        -webkit-animation-name: shake;
        -moz-animation-name: shake;
        animation-name: shake;
      }
  `],
    template: `
    <div [ngClass]="settings.modalClass" (click)="(!actionButtons || !actionButtons.length) && close()">
        <div class="modal-dialog" [ngClass]="settings.dialogClass">
          <div [ngClass]="[ showAlert ? settings.alertClass : '', settings.contentClass]">
            <div [ngClass]="settings.headerClass">
              <h4 [ngClass]="settings.headerTitleClass" *ngIf="title">{{title}}</h4>
              <button (click)="close()" *ngIf="!actionButtons || !actionButtons.length" type="button"
                [title]="settings.closeButtonTitle"
                [ngClass]="settings.closeButtonClass">
              </button>
            </div>
            <div [ngClass]="settings.bodyClass">
              <i #modalDialogBody></i>
            </div>
            <div [ngClass]="settings.footerClass" *ngIf="actionButtons && actionButtons.length">
              <button *ngFor="let button of actionButtons" (click)="doAction(button.onAction)"
                [ngClass]="button.buttonClass || settings.buttonClass">{{button.text}}</button>
            </div>
          </div>
        </div>
    </div>
    `
})
export class ModalDialogComponent implements IModalDialog, OnDestroy {
    @ViewChild('modalDialogBody', {read: ViewContainerRef})
    public dynamicComponentTarget: ViewContainerRef;
    public reference: ComponentRef<IModalDialog>;

    /** Modal dialog style settings */
    public settings: IModalDialogSettings = {
        dialogClass: 'modal-dialog-centered',
        // overlayClass: 'modal-backdrop fade show',
        modalClass: 'fade show modal',
        contentClass: 'modal-content',
        headerClass: 'modal-header',
        headerTitleClass: 'modal-title',
        closeButtonClass: 'close glyphicon glyphicon-remove',
        closeButtonTitle: 'CLOSE',
        bodyClass: 'modal-body',
        footerClass: 'modal-footer',
        alertClass: 'shake',
        alertDuration: 250,
        notifyWithAlert: true,
        buttonClass: 'btn btn-primary'
    };
    public actionButtons: IModalDialogButton[];
    public title: string;
    public onClose: () => Promise<any> | Observable<any> | boolean;
    public showAlert: boolean = false;

    private _inProgress = false;
    private _alertTimeout: number;
    private _childInstance: any;

    private _closeDialog$: Subject<void>;

    /**
     * CTOR
     * @param componentFactoryResolver
     */
    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    }

    /**
     * Initialize dialog with reference to instance and options
     * @param reference
     * @param options
     */
    dialogInit(reference: ComponentRef<IModalDialog>, options?: IModalDialogOptions) {
        this.reference = reference;

        // inject component
        if (options && options.childComponent) {
            let factory = this.componentFactoryResolver.resolveComponentFactory(options.childComponent);
            let componentRef = this.dynamicComponentTarget.createComponent(factory) as ComponentRef<IModalDialog>;
            this._childInstance = componentRef.instance as IModalDialog;

            this._closeDialog$ = new Subject<void>();
            this._closeDialog$.subscribe(_ => {
                this._finalizeAndDestroy();
            });

            options.closeDialogSubject = this._closeDialog$;

            this._childInstance['dialogInit'](componentRef, options);
            (document.activeElement as HTMLElement).blur();
        }
        // set options
        this._setOptions(options);
    }

    /**
     * Run action defined on action button
     * @param action
     */
    doAction(action?: ModalDialogOnAction) {
        // disable multi clicks
        if (this._inProgress) {
            return;
        }
        this._inProgress = true;
        this._closeIfSuccessful(action);
    }

    /**
     * Method to run on close
     * if action buttons are defined, it will not close
     */
    close() {
        if (this._inProgress) {
            return;
        }
        if (this.actionButtons && this.actionButtons.length) {
            return;
        }
        this._inProgress = true;

        if (this.onClose) {
            this._closeIfSuccessful(this.onClose);
            return;
        }
        this._finalizeAndDestroy();
    }

    /**
     * Cleanup on destroy
     */
    ngOnDestroy() {
        if (this._alertTimeout) {
            clearTimeout(this._alertTimeout);
            this._alertTimeout = null;
        }

        if (this._closeDialog$) {
            this._closeDialog$.unsubscribe();
        }
    }

    /**
     * Pass options from dialog setup to component
     * @param  {IModalDialogOptions} options?
     */
    private _setOptions(options?: IModalDialogOptions) {

        if (options && options.onClose && options.actionButtons && options.actionButtons.length) {
            throw new Error(`OnClose callback and ActionButtons are not allowed to be defined on the same dialog.`);
        }
        // set references
        this.title = (options && options.title) || '';
        this.onClose = (options && options.onClose) || null;
        this.actionButtons = (this._childInstance && this._childInstance['actionButtons']) ||
            (options && options.actionButtons) || null;
        if (options && options.settings) {
            Object.assign(this.settings, options.settings);
        }
    }

    /**
     * Close if successful
     * @param callback
     */
    private _closeIfSuccessful(callback: ModalDialogOnAction) {
        if (!callback) {
            return this._finalizeAndDestroy();
        }

        let response = callback();
        if (typeof response === 'boolean') {
            if (response) {
                return this._finalizeAndDestroy();
            }
            return this._triggerAlert();
        }
        if (response instanceof Promise) {
            response = Observable.fromPromise(<Promise<any>>response);
        }
        if (response instanceof Observable) {
            response.subscribe(() => {
                this._finalizeAndDestroy();
            }, () => {
                this._triggerAlert();
            });
        } else {
            this._inProgress = false;
        }
    }

    private _finalizeAndDestroy() {
        this._inProgress = false;
        this.reference.destroy();
    }

    private _triggerAlert() {
        if (this.settings.notifyWithAlert) {
            this.showAlert = true;
            this._alertTimeout = window.setTimeout(() => {
                this.showAlert = false;
                this._inProgress = false;
                clearTimeout(this._alertTimeout);
                this._alertTimeout = null;
            }, this.settings.alertDuration);
        }
    }
}
