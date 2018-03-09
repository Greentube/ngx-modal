import {
  Component,
  ComponentRef,
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewChild,
  OnDestroy, OnInit
} from '@angular/core';
import {
  IModalDialog,
  IModalDialogOptions,
  IModalDialogButton,
  IModalDialogSettings, ModalDialogOnAction
} from './modal-dialog.interface';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { delay } from 'rxjs/operators';

/**
 * Modal dialog component
 */
@Component({
  selector: 'modal-dialog',
  styles: [`
      @-moz-keyframes shake {
        from, to                { transform: translate3d(0, 0, 0); }
        10%, 30%, 50%, 70%, 90% { transform: translate3d(-2rem, 0, 0); }
        20%, 40%, 60%, 80%      { transform: translate3d(2rem, 0, 0); }
      }
      @-webkit-keyframes shake {
        from, to                { transform: translate3d(0, 0, 0); }
        10%, 30%, 50%, 70%, 90% { transform: translate3d(-2rem, 0, 0); }
        20%, 40%, 60%, 80%      { transform: translate3d(2rem, 0, 0); }
      }
      @keyframes shake {
        from, to                { transform: translate3d(0, 0, 0); }
        10%, 30%, 50%, 70%, 90% { transform: translate3d(-2rem, 0, 0); }
        20%, 40%, 60%, 80%      { transform: translate3d(2rem, 0, 0); }
      }

      .ngx-modal {
        display: flex;
      }
      .ngx-modal-shake {
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
    <div *ngIf="settings.overlayClass" [ngClass]="[settings.overlayClass, animateOverlayClass]"
         (click)="(!actionButtons || !actionButtons.length) && close()"></div>
    <div [ngClass]="[settings.modalClass, animateModalClass]">
      <div [ngClass]="settings.modalDialogClass">
        <div [ngClass]="[ showAlert ? settings.alertClass : '', settings.contentClass]">
          <div [ngClass]="settings.headerClass">
            <h4 [ngClass]="settings.headerTitleClass">{{title}}</h4>
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
                    [ngClass]="button.buttonClass || settings.buttonClass">{{button.text}}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ModalDialogComponent implements IModalDialog, OnDestroy, OnInit {
  @ViewChild('modalDialogBody', { read: ViewContainerRef })
  public dynamicComponentTarget: ViewContainerRef;
  public reference: ComponentRef<IModalDialog>;

  /** Modal dialog style settings */
  public settings: IModalDialogSettings = {
    overlayClass: 'modal-backdrop fade',
    overlayAnimationTriggerClass: 'show',
    modalClass: 'modal ngx-modal fade',
    modalAnimationTriggerClass: 'show',
    modalDialogClass: 'modal-dialog modal-dialog-centered',
    contentClass: 'modal-content',
    headerClass: 'modal-header',
    headerTitleClass: 'modal-title',
    closeButtonClass: 'close glyphicon glyphicon-remove',
    closeButtonTitle: 'CLOSE',
    bodyClass: 'modal-body',
    footerClass: 'modal-footer',
    alertClass: 'ngx-modal-shake',
    alertDuration: 250,
    notifyWithAlert: true,
    buttonClass: 'btn btn-primary'
  };
  public actionButtons: IModalDialogButton[];
  public title: string;
  public onClose: () => Promise<any> | Observable<any> | boolean;

  public showAlert: boolean = false;
  public animateOverlayClass = '';
  public animateModalClass = '';

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
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>> = {}) {
    this.reference = reference;

    // inject component
    if (options.childComponent) {
      let factory = this.componentFactoryResolver.resolveComponentFactory(options.childComponent);
      let componentRef = this.dynamicComponentTarget.createComponent(factory) as ComponentRef<IModalDialog>;
      this._childInstance = componentRef.instance as IModalDialog;

      this._closeDialog$ = new Subject<void>();
      this._closeDialog$.subscribe(() => {
        this._finalizeAndDestroy();
      });

      options.closeDialogSubject = this._closeDialog$;

      this._childInstance['dialogInit'](componentRef, options);
      document.activeElement != null ?
        (document.activeElement as HTMLElement).blur() :
        (document.body as HTMLElement).blur();
    }
    // set options
    this._setOptions(options);
  }

  ngOnInit() {
    // a trick to defer css animations
    of(void 0).pipe(delay(0)).subscribe(() => {
      this.animateOverlayClass = this.settings.overlayAnimationTriggerClass;
      this.animateModalClass = this.settings.modalAnimationTriggerClass;
    });
  }

  /**
   * Cleanup on destroy
   */
  ngOnDestroy() {
    // run animations
    this.animateOverlayClass = '';
    this.animateModalClass = '';

    // cleanup listeners
    if (this._alertTimeout) {
      clearTimeout(this._alertTimeout);
      this._alertTimeout = null;
    }

    if (this._closeDialog$) {
      this._closeDialog$.unsubscribe();
    }
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
   * Pass options from dialog setup to component
   * @param  {IModalDialogOptions} options?
   */
  private _setOptions(options: Partial<IModalDialogOptions<any>>) {

    if (options.onClose && options.actionButtons && options.actionButtons.length) {
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
      response = fromPromise(<Promise<any>>response);
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
