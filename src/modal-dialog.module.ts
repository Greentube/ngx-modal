// components and directives
import { ModalDialogComponent } from './modal-dialog.component';
import { ModalDialogService } from './modal-dialog.service';
import { SimpleModalComponent } from './simple-modal.component';
import { ModalDialogInstanceService } from './modal-dialog-instance.service';
// modules
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders, InjectionToken, SkipSelf, Optional } from '@angular/core';

/**
 * Guard to make sure we have single initialization of forRoot
 * @type {InjectionToken<ModalDialogModule>}
 */
export const MODAL_DIALOG_FORROOT_GUARD = new InjectionToken<ModalDialogModule>('MODAL_DIALOG_FORROOT_GUARD');

@NgModule({
    imports: [CommonModule],
    declarations: [ModalDialogComponent, SimpleModalComponent],
    exports: [ModalDialogComponent, SimpleModalComponent],
    providers: [ModalDialogService, ModalDialogInstanceService]
})
export class ModalDialogModule {

  public static forRoot(): ModuleWithProviders<ModalDialogModule> {
    return {
      ngModule: ModalDialogModule,
      providers: [
        {
          provide: MODAL_DIALOG_FORROOT_GUARD,
          useFactory: provideForRootGuard,
          deps: [ModalDialogModule, new Optional(), new SkipSelf()]
        },
        ModalDialogInstanceService
      ]
    };
  }
}

/**
 * @param dialogModule
 * @returns {string}
 */
export function provideForRootGuard(dialogModule: ModalDialogModule): string {
  if (dialogModule) {
    throw new Error(
      `ModalDialogModule.forRoot() called twice.`);
  }
  return 'guarded';
}
