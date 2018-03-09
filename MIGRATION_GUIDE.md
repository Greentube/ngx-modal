# Migration guide from 1.x.x to 2.x.x

The 2.0.0 release is introducing a breaking change in method signature, interfaces and default css classes.

This guide is provided to make the transition as painless as possible.

Steps to migrate your code are:
- update the npm package
- change code according to changes

1. Update in your package.json `ngx-modal-dialog` to the latest 2.x.x version 
([check the current release here](https://github.com/Greentube/ngx-modal/releases))
2. The `dialogInit` method had slightly changed:
    ```ts
    // old signature
    dialogInit(reference: ComponentRef<IModalDialog>, options?: IModalDialogOptions) {
    }

    // new signature
    dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>> = {}) {
    }
    ```
    You can now provide your custom type as a parameter in generic `IModalDialogOptions` interface to enforce 
    types strictness.
3. Dialog is now using only very basic styles (designed to work on top of Bootstrap 4) so you might need to modify your styles if you were heavily 
depending on the existing styles.
