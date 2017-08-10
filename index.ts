export * from './src/simple-modal.component';
export * from './src/modal-dialog.service';
export * from './src/modal-dialog.component';
export * from './src/modal-dialog.interface';

// components and directives
import { ModalDialogComponent } from './src/modal-dialog.component';
import { ModalDialogService } from './src/modal-dialog.service';
import { SimpleModalComponent } from './src/simple-modal.component';
import { ModalDialogInstanceService } from './src/modal-dialog-instance.service';
// modules
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

@NgModule({
  imports: [CommonModule],
  declarations: [ModalDialogComponent, SimpleModalComponent],
  entryComponents: [ModalDialogComponent, SimpleModalComponent],
  exports: [ModalDialogComponent, SimpleModalComponent],
  providers: [ModalDialogService]
})
export class ModalDialogModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ModalDialogModule,
      providers: [ModalDialogInstanceService]
    };
  }
}
