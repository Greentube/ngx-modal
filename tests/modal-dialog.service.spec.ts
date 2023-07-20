import { ComponentFactoryResolver, ComponentRef, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { IModalDialogOptions, IModalDialog } from '../src/modal-dialog.interface';
import { ModalDialogComponent } from '../src/modal-dialog.component';
import { ModalDialogService } from '../src/modal-dialog.service';
import { ModalDialogInstanceService } from '../src/modal-dialog-instance.service';

let compRef = {
  instance: {
    dialogInit: (reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>> = {}) => { /**/
    }
  },
  destroy() {
  }
};

class MockedViewContainerRef {
  createComponent(input: string) {
    return compRef;
  }
}

class MockedComponentFactoryResolver {
  resolveComponentFactory(type: any): string {
    return typeof type;
  }
}

describe('ModalDialog.Service: ', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
    providers: [
        ModalDialogService,
        { provide: ViewContainerRef, useClass: MockedViewContainerRef },
        { provide: ComponentFactoryResolver, useClass: MockedComponentFactoryResolver },
        ModalDialogInstanceService
    ],
    declarations: [ModalDialogComponent],
    teardown: { destroyAfterEach: false }
});
  });

  //let component;
  let componentFactoryResolver: any;
  // let viewRef: any;

  beforeEach(() => {
    componentFactoryResolver = new MockedComponentFactoryResolver();
    // viewRef = new MockedViewContainerRef();
  });

  it('should create DataCenterService', () => {
    let instanceService = new ModalDialogInstanceService();
    let service = new ModalDialogService(componentFactoryResolver, instanceService);
    expect(service.openDialog).toBeDefined();
  });

  // it('should call DynamicComponentLoader.loadNextToLocation on openDialog', () => {
  //
  //   //arrange
  //   let instanceService = new ModalDialogInstanceService();
  //   let service = new ModalDialogService(componentFactoryResolver, instanceService);
  //   let options = { title: 'ABC' };
  //
  //   //act
  //   spyOn(componentFactoryResolver, 'resolveComponentFactory').and.callThrough();
  //   spyOn(compRef.instance, 'dialogInit').and.stub();
  //   spyOn(compRef, 'destroy');
  //
  //   service.openDialog(viewRef, options);
  //
  //   //assert
  //   expect(componentFactoryResolver.resolveComponentFactory).toHaveBeenCalledWith(ModalDialogComponent);
  //   expect(compRef.instance.dialogInit).toHaveBeenCalledWith(compRef, options);
  //
  //   //Assert that the destroy has been called in the compRef
  //   service.openDialog(viewRef, options);
  //   expect(compRef.destroy).toHaveBeenCalled();
  // });
});
