# ngx-modal-dialog
[![Build Status](https://travis-ci.org/Greentube/ngx-modal.svg?branch=master)](https://travis-ci.org/Greentube/ngx-modal)
[![npm version](https://img.shields.io/npm/v/ngx-modal-dialog.svg)](https://www.npmjs.com/package/ngx-modal-dialog)
> Dynamic modal dialog for Angular that does not sit on DOM waiting to be triggered, but rather gets injected upon need.

Made with Bootstrap 4 styles in mind, but configurable to any framework or custom set of styles.
Simple demo can be found [here](https://greentube.github.io/ngx-modal/).

> This documentation is for version 3.x.x and Angular 6+. If you are using older version of Angular (v2-v5) please use [previous version](https://github.com/Greentube/ngx-modal/tree/v2.x.x).

# Table of contents:
- [Installation](#installation)
- [How it works](#how-it-works)
- [Styles and visuals](#styles-and-visuals)
- [Usage](#usage)
- [API](#api)
    - [ModalDialogService](#modaldialogservice)
    - [IModalDialog](#imodaldialog)
    - [IModalDialogOptions](#imodaldialogoptions)
    - [IModalDialogButton](#imodaldialogbutton)
    - [IModalDialogSettings](#imodaldialogsettings)
- [License](#license)

## Installation

```
npm install --save ngx-modal-dialog
```
## How it works
Modal dialog uses `ComponentFactoryResolver` to inject the given child component to the dialog.
[ModalDialogService](#modaldialogservice) makes sure that only one instance of a modal dialog is opened at a time.
With [IModalDialogOptions](#imodaldialogoptions) you can define which component will be rendered inside the dialog and configure it based on your needs.

You can further use action buttons to control modal dialog from external component or child component. If action performed on button click is successful, modal dialog will close. Otherwise it will alert user.

## Styles and visuals

`Ngx-modal-dialog` is intended to be used with Bootstrap 4, however you can apply your custom styles from your desired UI framework by providing class names in [IModalDialogSettings](#imodaldialogsettings).

## Usage

1. Include the `ngx-modal` module in your application at any place. The recommended way is to add `forRoot` initialization in the main app module.
```ts
import { BrowserModule } from '@angular/platform-browser';
import { ModalDialogModule } from 'ngx-modal-dialog';

@NgModule({
    imports: [
        BrowserModule,
        ModalDialogModule.forRoot()
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```
2. Create a custom component that implements `IModalDialog` or use the `SimpleModalDialog` as a child component.

Custom component should be inserted into both `declarations` and `entryComponents` in the NgModule they are part of. `entryComponents` has to be used since component is dynamically inserted onto the page and Angular is not aware of it.

3. Inject the `ModalDialogService` where you want to open the dialog. Call `openDialog` passing parent `ViewContainerRef` and partial `IModalDialogOptions` object:
```ts
constructor(modalService: ModalDialogService, viewRef: ViewContainerRef) { }

openNewDialog() {
  this.modalService.openDialog(this.viewRef, {
    title: 'Some modal title',
    childComponent: SimpleModalComponent
  });
}
```
4. Arbitrary define `actionButtons` in modal dialog options or child component to control modal dialog.

```ts
class MyModalComponent implements IModalDialog {
  actionButtons: IModalDialogButton[];

  constructor() {
    this.actionButtons = [
      { text: 'Close' }, // no special processing here
      { text: 'I will always close', onAction: () => true },
      { text: 'I never close', onAction: () => false }
    ];
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    // no processing needed
  }
}
```

Action button can be of two types:
- with return value  
  Used for controlling the dialog life.  
  If value is `truthful` (true, successful Promise or Observable) than it will close the dialog  
  If value is `falsy` (false, rejected Promise or failed Observable) it will trigger alert style and not close the dialog.
- without return value  
  Has no direct effect on dialog. Can be used to trigger some arbitrary functionality (e.g. copy values to clipboard)

## API

### ModalDialogService
#### Methods:
- `openDialog(target: ViewContainerRef, options: Partial<IModalDialogOptions<T>> = {})`: Closes existing and opens a new modal dialog according to IModalDialogOptions.
`T` represents a type of options `data` field. If you don't care about strong typing just pass `any`.

### IModalDialog
Every component that is used as modal dialog must implement `IModalDialog`.
#### Methods:
- `dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) => void`
Mandatory: `true`
Default: -
This method is called after initialization of child component. Purpose of the method is to pass necessary information from outer scope to child component.
#### Properties:
- `actionButtons`
Mandatory: `false`
Default: -
Type: `string`
Modal heading text

### IModalDialogOptions
#### Interface:
```ts
interface IModalDialogOptions<T> {
  title: string;
  childComponent: IModalDialog;
  onClose: ModalDialogOnAction;
  actionButtons: IModalDialogButton[];
  data: T;
  placeOnTop: boolean;
  settings: IModalDialogSettings;
  closeDialogSubject: Subject<void>;
}
```
This is generic interface, where `T` is arbitrary type of `data` section.
#### Interface details:
- title: `string`  
Modal heading text

- childComponent: `any`  
Component type that will be rendered as a content of modal dialog. Component must implement `IModalDialog` interface.

- onClose(): `ModalDialogOnAction`
Function to be called on close button click. In case of Promise and Observable, modal dialog will not close unless successful resolve happens. In case of boolean, modal dialog will close only if result is `truthful`.

- actionButtons: `Array<IModalDialogButton>`  
Footer action buttons for control of modal dialog. See [IModalDialogButton](#imodaldialogbutton).
Action buttons defined in child component have priority over action buttons defined via options.
Action buttons close the modal dialog upon successful operation.

- data: `T`  
Arbitrary data that will be passed to child component via `dialogInit` method.

- placeOnTop: `boolean`
Flag stating whether opening the modal dialog should close all the other modal dialogs, or modal should be rendered on top of existing ones.


- settings: `IModalDialogSettings`  
Additional settings for granular configuration of modal dialog. See [IModalDialogSettings](#imodaldialogsettings).

- closeDialogSubject:`Subject<void>`  
Custom modal closing subject. Can be used to manually trigger modal dialog close from within the child component. 

### IModalDialogButton
#### Interface:
```ts
interface IModalDialogButton {
  text: string;
  buttonClass?: string;
  onAction?: ModalDialogOnAction;
}
```
#### Interface details:
- text: `string`  
Caption/text on the button
- buttonClass: `string`  
Default: `btn btn-primary`  
Class name of button
- onAction(): `Promise<any> | Observable<any> | boolean`  
Function to be called on button click. In case of Promise and Observable, modal dialog will not close unless successful resolve happens. In case of boolean, modal dialog will close only if result is `truthful`.
#### ModalDialogOnAction type
```ts
type ModalDialogOnAction = () => Promise<any> | Observable<any> | boolean | void;
```
Function returning Promise, Observable, boolean or no value. Modal dialog will close automatically if return of action is:
* Promise, once promise gets resolved
* Observable, once observable successfully finishes
* boolean and value is `true`

Action button will initiate alert behavior if return is:
* Promise, once promise gets rejected
* Observable, once observable fails or throws error
* boolean and value is `false`

If action button returns `void`, there are no side effects.

### IModalDialogSettings
#### Interface
```ts
interface IModalDialogSettings {
  overlayClass: string;
  overlayAnimationTriggerClass: string;
  modalClass: string;
  modalAnimationTriggerClass: string;
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
```

#### Interface details:
- overlayClass: `string`  
Default: `modal-backdrop fade show`  
Style of the backdrop overlay layer
- overlayAnimationTriggerClass: `string`  
Default: `show`  
Class that triggers the initial/ending animation of modal overlay
- modalClass: `string`  
Default: `modal fade ngx-modal`  
Style of modal wrapper
- modalAnimationTriggerClass: `string`  
Default: `show`  
Class that triggers the initial/ending animation of modal wrapper
- modalDialogClass: `string`  
Default: `modal-dialog modal-dialog-centered`  
Style of modal dialog
- contentClass: `string`  
Default: `modal-content`  
Modal dialog inner content class
- headerClass: `string`  
Default: `modal-header`  
Modal dialog header class
- headerTitleClass: `string`  
Default: `modal-title`  
Modal dialog header title class
- closeButtonClass: `string`  
Default: `close glyphicon glyphicon-remove`  
Modal dialog header close button class
- closeButtonTitle: `string`  
Default: `CLOSE`  
Close button title
- bodyClass: `string`  
Default: `modal-body`  
Modal dialog body class
- footerClass: `string`  
Default: `modal-footer`  
Modal dialog footer class
- alertClass: `string`  
Default: `ngx-modal-shake`  
Style to be appended to dialog once alert happens
- alertDuration: `number`  
Default: `250`  
Duration of alert animation
- buttonClass: `string`  
Default: `btn btn-primary`  
Style of footer action buttons
- notifyWithAlert: `number`  
Default: `true`  
Define whether modal should alert user when action fails

## License
Licensed under MIT
