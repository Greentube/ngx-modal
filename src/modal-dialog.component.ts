import {
  Component,
  ComponentRef,
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewChild,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import {
  IModalDialog,
  IModalDialogOptions,
  IModalDialogButton,
  IModalDialogSettings
} from './modal-dialog.interface';
import { Observable } from 'rxjs/Observable';

/**
 * Modal dialog component
 * Usage:
 *
 * Model properties are:
 *
 */
@Component({
  selector: 'modal-dialog',
  styleUrls: ['./modal-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [ngClass]="settings.overlayClass" (click)="(!actionButtons || !actionButtons.length) && close()"></div>
    <div class="modal" [ngClass]="settings.modalClass">
      <div class="modal-content" [ngClass]="{settings.alertClass: showAlert, settings.contentClass}">
        <div [ngClass]="settings.headerClass">
          <h4 class="modal-title">{{title}}</h4>
          <button (click)="close()" *ngIf="!prompt" type="button"
            [title]="'CLOSE'"
            class="close theme-icon-close">
          </button>
        </div>
        <div [ngClass]="settings.bodyClass">
          <i #modalDialogBody></i>
        </div>
        <div [ngClass]="settings.footerClass" *ngIf="actionButtons && actionButtons.length">
          <button *ngFor="let button of actionButtons" (click)="doAction(button.onAction)"
            [ngClass]='button.buttonClass || settings.buttonClass'>{{button.text}}</button>
        </div>
      </div>
    </div>
    `
})
export class ModalDialogComponent implements IModalDialog, OnDestroy {
  @ViewChild('modalDialogBody', { read: ViewContainerRef })
  protected dynamicComponentTarget: ViewContainerRef;
  protected reference: ComponentRef<IModalDialog>;

  /** Modal dialog style settings */
  protected settings: IModalDialogSettings = {
    overlayClass: 'modal-backdrop fade show',
    modalClass: 'fade show',
    contentClass: '',
    headerClass: 'modal-header',
    bodyClass: 'modal-body',
    footerClass: 'modal-footer',
    alertClass: 'shake',
    alertDuration: 250,
    notifyWithAlert: true,
    buttonsClass: 'btn btn-primary'
  };
  protected actionButtons: IModalDialogButton[];
  protected title: string;
  protected onClose: () => Promise<any> | Observable<any> | boolean;
  protected showAlert: boolean = false;

  private _inProgress = false;
  private _alertTimeout: number;

  /**
   * CTOR
   * @param componentFactoryResolver
   */
  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

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
      let childInstance = componentRef.instance as IModalDialog;
      childInstance['dialogInit'](componentRef, options);

      (document.activeElement as HTMLElement).blur();
    }
    // set options
    this._setOptions(options);
  }

  doAction(action: () => Promise<any> | Observable<any> | boolean) {
    // disable multi clicks
    if (this._inProgress) {
      return;
    }
    this._inProgress = true;
    this._closeIfSuccessfull(action);
  }

  /**
   * Method to run on close
   * if prompt or onCancel are defiend, it will run them before destroying component
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
      this._closeIfSuccessfull(this.onClose);
      return;
    }
    this.reference.destroy();
    this._inProgress = false;
  }

  /**
   * Cleanup on destroy
   */
  ngOnDestroy() {
    if (this._alertTimeout) {
      clearTimeout(this._alertTimeout);
      this._alertTimeout = null;
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
    this.title = options.title || '';
    this.onClose = options.onClose || null;
    this.actionButtons = options.actionButtons || null;
    this.settings = null; // TODO: do something
  }

  private _closeIfSuccessfull(callback: () => Promise<any> | Observable<any> | boolean) {
    let response = callback();
    if (typeof response === 'boolean') {
      if (response) {
        this._inProgress = false;
        this.reference.destroy();
      }
      return;
    }
    if (typeof response === 'Promise') {
      response = Observable.fromPromise(<Promise<any>>response);
    }
    response.subscribe(() => {
      this._inProgress = false;
      this.reference.destroy();
    }, () => {
      if (this.settings.notifyWithAlert) {
        this.showAlert = true;
        this._alertTimeout = window.setTimeout(() => {
          this.showAlert = false;
          this._inProgress = false;
          clearTimeout(this._alertTimeout);
          this._alertTimeout = null;
        }, this.settings.alertDuration);
      }
    });
  }
}
