import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CustomModalComponent } from './dialogs/custom-modal.component';
import { ModalDialogModule } from 'ngx-modal-dialog';

@NgModule({
  declarations: [AppComponent, CustomModalComponent],
  imports: [
    BrowserModule,
    ModalDialogModule.forRoot()
  ],
  entryComponents: [CustomModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
