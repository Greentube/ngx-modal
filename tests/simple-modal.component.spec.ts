import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SimpleModalComponent } from '../src/simple-modal.component';

let fixture: ComponentFixture<SimpleModalComponent>;

describe('SimpleModal.Component: ', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [SimpleModalComponent],
    teardown: { destroyAfterEach: false }
});
    fixture = TestBed.createComponent(SimpleModalComponent);
  });

  it('should create component', () => {
    expect(fixture).toBeDefined();
  });

  it('should create component and pass text', () => {
    let testText = 'SOME TEXT';
    let instance = fixture.componentInstance;
    instance.dialogInit(fixture.componentRef, {
      data: { text: testText }
    });
    fixture.detectChanges();
    let self = fixture.debugElement.nativeElement;

    expect(self.innerHTML).toEqual(testText);
  });
  it('should throw exception if no data in options', () => {
    let instance = fixture.componentInstance;

    expect(() => {
      instance.dialogInit(fixture.componentRef, {});
    }).toThrowError(/Data information for simple modal dialog is missing/);
  });
});
