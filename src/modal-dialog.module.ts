// components and directives
import { ModalDialogComponent } from './modal-dialog.component';
import { ModalDialogService } from './modal-dialog.service';
import { SimpleModalComponent } from './simple-modal.component';
import { ModalDialogInstanceService } from './modal-dialog-instance.service';
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
