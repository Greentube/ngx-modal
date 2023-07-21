// import { ComponentRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ModalDialogComponent } from '../src/modal-dialog.component';
import { ModalDialogInstanceService } from '../src/modal-dialog-instance.service';

// let compRef: ComponentRef<ModalDialogComponent> = {
//   instance: null,
//   location: null,
//   injector: null,
//   hostView: null,
//   changeDetectorRef: null,
//   componentType: null,
//   onDestroy: null,
//   destroy() {
//   }
// };

describe('ModalDialogInstance.Service: ', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [
        ModalDialogInstanceService
    ],
    declarations: [ModalDialogComponent],
    teardown: { destroyAfterEach: false }
});
  });

  it('should create ModalDialogInstanceService', () => {
    let service = new ModalDialogInstanceService();
    expect(service.closeAnyExistingModalDialog).toBeDefined();
    expect(service.saveExistingModalDialog).toBeDefined();
  });

  // it('should save and close dialog', () => {
  //   let service = new ModalDialogInstanceService();
  //
  //   spyOn(compRef, 'destroy');
  //   service.saveExistingModalDialog(<ComponentRef<ModalDialogComponent>> compRef);
  //   service.closeAnyExistingModalDialog();
  //   expect(compRef.destroy).toHaveBeenCalled();
  // });
});
