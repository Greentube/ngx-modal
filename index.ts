export * from './src/simple-modal.component';
export * from './src/modal-dialog.service';
export * from './src/modal-dialog.component';
export * from './src/modal-dialog.interface';

import { NgModule, ModuleWithProviders } from '@angular/core';

// components and directives
import { ModalDialogComponent } from './src/modal-dialog.component';
import { ModalDialogService } from './src/modal-dialog.service';
import { SimpleModalComponent } from './src/simple-modal.component';
// modules
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [ TranslateModule, CommonModule ],
    declarations: [ ModalDialogComponent, SimpleModalComponent ],
    entryComponents: [ ModalDialogComponent, SimpleModalComponent ],
    exports: [ ModalDialogComponent, SimpleModalComponent ]
})
export class ModalDialogModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ModalDialogModule,
            providers: [ ModalDialogService ]
        };
    }
}