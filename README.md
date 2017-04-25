# ngx-modal-dialog
[![Build Status](https://travis-ci.org/Greentube/ngx-modal.svg?branch=master)](https://travis-ci.org/Greentube/ngx-modal)
[![npm version](https://img.shields.io/npm/v/ngx-modal-dialog.svg)](https://www.npmjs.com/package/ngx-modal-dialog)
> Dynamic modal dialog for Angular that does not sit on DOM waiting to be triggered, but rather gets injected upon need.

> Made with Bootstrap 4 styles in mind, but configurable to any framework or custom set of styles

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

## Styles and visuals

`Ngx-modal-dialog` is intended to be used with Bootstrap 4, however you can apply your custom styles from your desired UI framework by providing class names in [IModalDialogSettings](#imodaldialogsettings).

## Usage

1. Include the `ngx-modal` module in your application at any place. The recommended way is to add `forRoot` initialization in the main app module.
```ts
import { BrowserModule } from '@angular/platform-browser';
import { ModalDialogModule } from '@greentube/ngx-modal';

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

3. Inject the `ModalDialogService` where you want to open the dialog. Call `openDialog` passing parent `ViewContainerRef` and `IModalDialogOptions`:
```ts
constructor(modalService: ModalDialogService, viewRef: ViewContainerRef) { }

openNewDialog() {
  this.modalService.openDialog(this.viewRef, {
    title: 'Some modal title',
    childComponent: SimpleModalComponent
  });
}
```
## API

### ModalDialogService
#### Methods:
- `openDialog(target: ViewContainerRef, dialogOptions?: IModalDialogOptions)`: Closes existing and opens a new modal dialog according to IModalDialogOptions.

### IModalDialog
Every component that is used as modal dialog must implement `IModalDialog`.
#### Methods:
- `dialogInit(reference: ComponentRef<IModalDialog>, options?: IModalDialogOptions) => void`: This method is called after initialization of child component. Purpose of the method is to pass necessary information from outer scope to child component.

### IModalDialogOptions
#### Interface
```ts
interface IModalDialogOptions {
  title?: string;
  childComponent?: any;
  onClose?: () => Promise<any> | Observable<any> | boolean;
  actionButtons?: IModalDialogButton[];
  data?: any;
  settings?: IModalDialogSettings;
}
```
#### Properties
##### title
Mandatory: `false`  
Default: -  
Type: `string`  
Modal heading text

##### childComponent
Mandatory: `false`  
Default: -  
Type: `any`  
Component type that will be rendered as a content of modal dialog. Component must implement `IModalDialog` interface.

##### onClose () => Promise<any> | Observable<any> | boolean
Mandatory: `false`  
Default: -  
Type: `function`
Input: -  
ReturnType: `Promise<any>` or `Observable<any>` or `boolean`  
Function to be called on close button click. In case of Promise and Observable, modal dialog will not close unless successful resolve happens. In case of boolean, modal dialog will close only if result is `truthful`.

##### actionButtons
Mandatory: `false`  
Default: -  
Type: `Array of IModalDialogButton`  
Footer action buttons for control of modal dialog. See [IModalDialogButton](#imodaldialogbutton).

##### data
Mandatory: `false`  
Default: -  
Type: -  
Arbitrary data that will be passed to child component via `dialogInit` method.

##### settings
Mandatory: `false`  
Default: -  
Type: `IModalDialogSettings`  
Additional settings for granular configuration of modal dialog. See [IModalDialogSettings](#imodaldialogsettings).

### IModalDialogButton
#### Interface
```ts
interface IModalDialogButton {
  text: string;
  buttonClass?: string;
  onAction?: () => Promise<any> | Observable<any> | boolean;
}
```
#### Properties
##### text
Mandatory: `true`  
Default: -   
Type: `string`  
Caption/text on the button
##### buttonClass
Mandatory: `false`  
Default: `btn btn-primary`  
Type: `string`  
Class name of button
##### onAction
Mandatory: `false`  
Default: -  
Type: `function`  
Input: -      
ReturnType: `Promise<any> | Observable<any> | boolean`  
Function to be called on button click. In case of Promise and Observable, modal dialog will not close unless successful resolve happens. In case of boolean, modal dialog will close only if result is `truthful`.

### IModalDialogSettings
#### Interface
```ts
interface IModalDialogSettings {
  overlayClass?: string;
  modalClass?: string;
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
```

#### Properties
##### overlayClass
Mandatory: `false`  
Default: `modal-backdrop fade show`  
Type: `string`  
Style of the backdrop overlay layer
##### modalClass
Mandatory: `false`  
Default: `modal fade show`  
Type: `string`  
Style of modal wrapper
##### contentClass
Mandatory: `false`  
Default: `modal-content`  
Type: `string`  
Modal dialog inner content class
##### headerClass
Mandatory: `false`  
Default: `modal-header`  
Type: `string`  
Modal dialog header class
##### headerTitleClass
Mandatory: `false`  
Default: `modal-title`  
Type: `string`  
Modal dialog header title class
##### closeButtonClass
Mandatory: `false`  
Default: `close glyphicon glyphicon-remove`  
Type: `string`  
Modal dialog header close button class
##### closeButtonTitle
Mandatory: `false`  
Default: `CLOSE`  
Type: `string`  
Close button title
##### bodyClass
Mandatory: `false`  
Default: `modal-body`  
Type: `string`  
Modal dialog body class
##### footerClass
Mandatory: `false`  
Default: `modal-footer`  
Type: `string`  
Modal dialog footer class
##### alertClass
Mandatory: `false`  
Default: `shake`  
Type: `string`  
Style to be appended to dialog once alert happens
##### alertDuration
Mandatory: `false`  
Default: `250`  
Type: `number`  
Duration of alert animation
##### buttonClass
Mandatory: `false`  
Default: `btn btn-primary`  
Type: `string`  
Style of footer action buttons
##### notifyWithAlert
Mandatory: `false`  
Default: `true`  
Type: `boolean`  
Define whether modal should alert user when action fails

## License
Licensed under MIT
