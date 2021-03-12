import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { ModalDialogModule } from 'ngx-modal-dialog';

import {AppComponent} from './app.component';
import {CustomModalComponent} from './dialogs/custom-modal.component';
import {DynamicModalComponent} from './dialogs/dynamic-modal.component';
import {CustomHeaderModalComponent} from './dialogs/custom-header-modal.component';

@NgModule({
  declarations: [AppComponent, CustomModalComponent, DynamicModalComponent, CustomHeaderModalComponent],
  imports: [
    BrowserModule,
    ModalDialogModule.forRoot()
  ],
  entryComponents: [CustomModalComponent, DynamicModalComponent, CustomHeaderModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
