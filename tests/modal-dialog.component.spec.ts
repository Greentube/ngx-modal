import { ComponentRef, Component } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ModalDialogComponent } from '../src/modal-dialog.component';
import { IModalDialog, IModalDialogOptions } from '../src/modal-dialog.interface';
import { CommonModule } from '@angular/common';
import { Subject, of } from 'rxjs';

let fixture: ComponentFixture<ModalDialogComponent>;

@Component({
  selector: 'dummy',
  template: `{{props}}`
})
class DummyComponent implements IModalDialog {
  props: any;
  closingSubject$: Subject<void>;

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>> = {}) {
    this.props = options.data;
    this.closingSubject$ = options.closeDialogSubject;
  }

  closeMe() {
    if (this.closingSubject$) {
      this.closingSubject$.next();
    }
  }
}

describe('ModalDialog.Component:', () => {
  let component: ModalDialogComponent;
  let sampleText: string;
  let onCloseWrapper: any;
  let data: any;
  let actionButtons: any[];

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    let module = TestBed.configureTestingModule({
    imports: [CommonModule],
    declarations: [ModalDialogComponent, DummyComponent],
    teardown: { destroyAfterEach: false }
});
    module.overrideModule(BrowserDynamicTestingModule, {
      set: { entryComponents: [DummyComponent] }
    });

    fixture = module.createComponent(ModalDialogComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    sampleText = 'sample text';
    data = { some: 'data' };
    onCloseWrapper = {
      onClose: () => new Promise<string>((resolve: any) => {
        resolve();
      })
    };
    actionButtons = [
      { text: 'abc', onAction: () => {
          return new Promise<string>((resolve: any) => {
            resolve();
          });
        } },
      { text: 'def', onAction: () => true },
      { text: 'hgi', onAction: () => of(true) }
    ];
  });

  it('should initialize component and define dialogInit method', () => {
    expect(component.dialogInit).toBeDefined('should define dialogInit method');
  });

  it('should set methods from options and initialize component', () => {
    sampleText = 'sample text';
    let onClose = () => new Promise<string>((resolve: any) => {
      resolve();
    });
    data = { some: 'data' };

    component.dialogInit(fixture.componentRef, {
      title: sampleText,
      onClose: onClose,
      data: data
    });

    // TODO: Fix those
    // expect(component.title).toEqual(sampleText, 'title should equal sample text');
    // expect(component.onClose).toEqual(onClose, 'onClose should eqaul defined function');
    // expect(component.data).toEqual(data, 'data should equal defined value');
  });

  it('should set default values if no options passed', () => {
    component.dialogInit(fixture.componentRef);

    // TODO: Fix those
    // expect(component.title).toEqual('', 'default title should be ""');
    // expect(component.onClose).toEqual(null, 'onClose should be null');
    // expect(component.prompt).toEqual(null, 'prompt should be null');
    // expect(component.data).toEqual(null, 'data should be null');
  });

  it('should throw exception if both onClose and prompt are set', () => {
    function testFunction() {
      component.dialogInit(fixture.componentRef, {
        title: sampleText,
        onClose: onCloseWrapper.onClose,
        actionButtons: actionButtons,
        data: data
      });
    }

    // act + assert
    expect(testFunction).toThrowError(/OnClose callback and ActionButtons/);

    component.close();
  });

  it('should call onAction callback on button click and remove component reference after',
    fakeAsync(() => {
      component.dialogInit(fixture.componentRef, {
        title: sampleText,
        actionButtons: actionButtons,
        data: data
      });
      // pre-check
      spyOn(actionButtons[0], 'onAction').and.callThrough();
      spyOn(fixture.componentRef, 'destroy').and.callThrough();
      // act
      component.doAction(actionButtons[0].onAction);
      // assert
      expect(actionButtons[0].onAction).toHaveBeenCalled();
      tick();
      expect(fixture.componentRef.destroy).toHaveBeenCalled();
    })
  );

  it('should not remove component if onAction fails and show alert', fakeAsync(() => {
    component.dialogInit(fixture.componentRef, {
      title: sampleText,
      actionButtons: actionButtons,
      data: data
    });
    actionButtons[0].onAction = () => new Promise<string>((resolve: any, reject: any) => {
      reject();
    });
    fixture.detectChanges();
    let modalDialog = fixture.nativeElement.querySelector('.modal-content');
    // pre-check
    spyOn(fixture.componentRef, 'destroy').and.callThrough();
    // act
    component.doAction(actionButtons[0].onAction);
    // assert
    tick();
    fixture.detectChanges();
    expect(modalDialog.className).toMatch(/shake/);
    jasmine.clock().tick(300);
    fixture.detectChanges();
    expect(modalDialog.className).not.toMatch(/shake/);

    expect(fixture.componentRef.destroy).not.toHaveBeenCalled();
  }));

  it('should call onAction callback only once',
    fakeAsync(() => {
      component.dialogInit(fixture.componentRef, {
        title: sampleText,
        actionButtons: actionButtons,
        data: data
      });
      // pre-check
      spyOn(actionButtons[0], 'onAction').and.callThrough();
      spyOn(fixture.componentRef, 'destroy').and.callThrough();
      // act
      component.doAction(actionButtons[0].onAction);
      component.doAction(actionButtons[0].onAction);
      // assert
      expect(actionButtons[0].onAction.calls.count()).toEqual(1);
      tick();
    })
  );

  it('should remove component reference on accept button even if no prompt defined',
    fakeAsync(() => {
      component.dialogInit(fixture.componentRef, {
        title: sampleText,
        data: data
      });
      // pre-check
      spyOn(fixture.componentRef, 'destroy').and.callThrough();
      // act
      component.doAction(actionButtons[0].onAction);
      // assert
      tick();
      expect(fixture.componentRef.destroy).toHaveBeenCalled();
    })
  );

  it('should remove component reference on doAction even if no callback defined', fakeAsync(() => {
    component.dialogInit(fixture.componentRef, {
      title: sampleText,
      data: data
    });
    // pre-check
    spyOn(fixture.componentRef, 'destroy').and.callThrough();
    // act
    component.doAction();
    // assert
    tick();
    expect(fixture.componentRef.destroy).toHaveBeenCalled();
  }));

  it('should remove reference on close button',
    fakeAsync(() => {
      component.dialogInit(fixture.componentRef, {
        title: sampleText,
        data: data
      });
      // pre-check
      spyOn(fixture.componentRef, 'destroy').and.callThrough();
      // act
      component.close();
      // assert
      tick();
      expect(fixture.componentRef.destroy).toHaveBeenCalled();
    })
  );

  it('should create the component', () => {
    expect(fixture.componentInstance instanceof ModalDialogComponent)
      .toBe(true, 'should create ModalDialogComponent');
  });

  it('should inject new component', fakeAsync(() => {
    let testString = 'some data';

    component.dialogInit(fixture.componentRef, {
      childComponent: DummyComponent,
      data: testString
    });

    fixture.detectChanges();
    // flush async calls
    tick();
    fixture.detectChanges();

    let innerComponent = fixture.debugElement.query(By.css('.modal-body')).nativeElement;

    expect(innerComponent).toBeDefined('modal dialog body should be defined');
    expect(innerComponent.innerHTML).toContain(testString);
  }));

  it('should close dialog from child component', fakeAsync(() => {
    let testString = 'some data';

    component.dialogInit(fixture.componentRef, {
      childComponent: DummyComponent,
      data: testString
    });

    fixture.detectChanges();

    const dummyDebugElem = fixture.debugElement.query(By.css('dummy'));
    const dummyComponent = dummyDebugElem.injector.get(DummyComponent) as DummyComponent;

    spyOn(fixture.componentRef, 'destroy').and.callThrough();
    spyOn(dummyComponent, 'closeMe').and.callThrough();

    // act
    dummyComponent.closeMe();
    tick();

    // assert
    expect(dummyComponent.closeMe).toHaveBeenCalled();
    expect(fixture.componentRef.destroy).toHaveBeenCalled();
  }));

  it('should unsubscribe from subject when closing dialog from child component', fakeAsync(() => {
    let testString = 'some data';

    component.dialogInit(fixture.componentRef, {
      childComponent: DummyComponent,
      data: testString
    });

    fixture.detectChanges();

    const dummyDebugElem = fixture.debugElement.query(By.css('dummy'));
    const dummyComponent = dummyDebugElem.injector.get(DummyComponent) as DummyComponent;

    spyOn(dummyComponent.closingSubject$, 'unsubscribe').and.callThrough();
    spyOn(dummyComponent, 'closeMe').and.callThrough();

    // act
    dummyComponent.closeMe();
    tick();

    // assert
    expect(dummyComponent.closeMe).toHaveBeenCalled();
    expect(dummyComponent.closingSubject$.unsubscribe).toHaveBeenCalled();
  }));
});
