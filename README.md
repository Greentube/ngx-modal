# ngx-modal-dialog
[![Build Status](https://travis-ci.org/Greentube/ngx-modal.svg?branch=master)](https://travis-ci.org/Greentube/ngx-modal)
> Dynamic modal dialog for Angular that does not sit on DOM waiting to be triggered, but rather gets injected upon need.

# Table of contents:
- [Installation](#installation)
- [How it works](#how-it-works)
- [Usage](#usage)
- [API](#api)
    - [ModalDialogService](#modaldialogservice)
    - [IModalDialog](#imodaldialog)
    - [IModalDialogOptions](#imodaldialogoptions)
    - [IModalDialogButton](#imodaldialogbutton)
    - [IModalDialogSettings](#imodaldialogsettings)
- [License](#license)

## Installation

**SOON!**
```
npm install --save @greentube/ngx-modal
```
## How it works
Modal dialog uses `ComponentFactoryResolver` to inject the given child component to the dialog.
[ModalDialogService](#modaldialogservice) makes sure that only one instance of a modal dialog is opened at a time.
With [IModalDialogOptions](#imodaldialogoptions) you can define which component will be rendered inside the dialog and configure it based on your needs. 

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
#### Interface definition
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

### IModalDialogButton
#### Interface definition
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
ReturnType: `Promise<any> | Observable<any> | boolean`
Function to be called on button click. In case of Promise and Observable, modal dialog will not close unless successful resolve happens. In case of boolean, modal dialog will close only if result is `truthful`.

### IModalDialogSettings
#### Interface definition
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
  buttonsClass?: string;
  notifyWithAlert?: boolean;
}
```
#### Properties
TBD:

## License
Licensed under MIT
