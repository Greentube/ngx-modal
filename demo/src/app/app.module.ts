import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CustomModalComponent } from './dialogs/custom-modal.component';
import { ModalDialogModule } from 'ngx-modal-dialog';
import { DynamicModalComponent } from './dialogs/dynamic-modal.component';

@NgModule({
  declarations: [AppComponent, CustomModalComponent, DynamicModalComponent],
  imports: [
    BrowserModule,
    ModalDialogModule.forRoot()
  ],
  entryComponents: [CustomModalComponent, DynamicModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
