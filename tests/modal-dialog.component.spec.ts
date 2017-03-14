import { ComponentRef, Component } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ModalDialogComponent } from '../src/modal-dialog.component';
import { IModalDialog, IModalDialogOptions } from '../src/modal-dialog.interface';
import { CommonModule } from '@angular/common';

let fixture: ComponentFixture<ModalDialogComponent>;

@Component({
    selector: 'dummy',
    template: `{{props}}`
})
class DummyComponent implements IModalDialog {
    props: any;

    dialogInit(reference: ComponentRef<IModalDialog>, options?: IModalDialogOptions) {
        this.props = options.data;
    };
}

describe('ModalDialog.Component:', () => {
    let component: ModalDialogComponent;

    beforeEach(() => {
        jasmine.clock().uninstall();
        jasmine.clock().install();

        let module = TestBed.configureTestingModule({
            imports: [CommonModule],
            declarations: [ModalDialogComponent, DummyComponent]
        });
        module.overrideModule(BrowserDynamicTestingModule, {
            set: { entryComponents: [DummyComponent] }
        });
        fixture = module.createComponent(ModalDialogComponent);
    });

    let sampleText: string;
    let onClose: any;
    let data: any;
    let prompt: any;

    beforeEach(() => {
        sampleText = 'sample text';
        data = { some: 'data' };
        onClose = () => new Promise<string>((resolve: any) => {
            resolve();
        });
        prompt = {
            onPromptOk: () => new Promise<string>((resolve: any) => {
                resolve();
            }),
            onPromptCancel: () => new Promise<string>((resolve: any) => {
                resolve();
            })
        };
    });

    it('should initialize component and define dialogInit method', () => {
        component = fixture.componentInstance;
        expect(component.dialogInit).toBeDefined('should define dialogInit method');
    });

    it('should set methods from options and initialize component', () => {
        let sampleText = 'sample text';
        let onClose = () => new Promise<string>((resolve: any) => {
            resolve();
        });
        let data = { some: 'data' };

        component = fixture.componentInstance;
        component.dialogInit(fixture.componentRef, {
            title: sampleText,
            onClose: onClose,
            data: data
        });

        expect(component.title).toEqual(sampleText, 'title should equal sample text');
        expect(component.onClose).toEqual(onClose, 'onClose should eqaul defined function');
        expect(component.data).toEqual(data, 'data should equal defined value');
    });

    it('should set default values if no options passed', () => {
        component = fixture.componentInstance;
        component.dialogInit(fixture.componentRef);

        expect(component.title).toEqual('', 'default title should be ""');
        expect(component.onClose).toEqual(null, 'onClose should be null');
        expect(component.prompt).toEqual(null, 'prompt should be null');
        expect(component.data).toEqual(null, 'data should be null');
    });



    it('should throw exception if both onClose and prompt are set', () => {
        component = fixture.componentInstance;
        function testFunction() {
            component.dialogInit(fixture.componentRef, {
                title: sampleText,
                onClose: onClose,
                prompt: prompt,
                data: data
            });
        }

        // act + assert
        expect(testFunction).toThrowError(/OnClose and Prompt/);

        component.close();
    });

    it('should call onPromptOk callback on accept button and remove component reference after',
        fakeAsync(() => {
            component = fixture.componentInstance;
            component.dialogInit(fixture.componentRef, {
                title: sampleText,
                prompt: prompt,
                data: data
            });
            // pre-check
            spyOn(prompt, 'onPromptOk').and.callThrough();
            spyOn(fixture.componentRef, 'destroy').and.callThrough();
            // act
            component.accept();
            // assert
            expect(prompt.onPromptOk).toHaveBeenCalled();
            tick();
            expect(fixture.componentRef.destroy).toHaveBeenCalled();
        })
    );

    it('should not remove component if promptOk fails and show alert', fakeAsync(() => {
        component = fixture.componentInstance;
        component.dialogInit(fixture.componentRef, {
            title: sampleText,
            prompt: prompt,
            data: data
        });
        prompt.onPromptOk = () => new Promise<string>((resolve: any, reject: any) => {
            reject();
        });
        fixture.detectChanges();
        let modalDialog = fixture.nativeElement.querySelector('.modal-content');
        // pre-check
        spyOn(fixture.componentRef, 'destroy').and.callThrough();
        // act
        component.accept();
        // assert
        tick();
        fixture.detectChanges();
        expect(modalDialog.className).toMatch(/shake/);
        jasmine.clock().tick(300);
        fixture.detectChanges();
        expect(modalDialog.className).not.toMatch(/shake/);

        expect(fixture.componentRef.destroy).not.toHaveBeenCalled();
    }));

    it('should call onPromptOk callback only once',
        fakeAsync(() => {
            component = fixture.componentInstance;
            component.dialogInit(fixture.componentRef, {
                title: sampleText,
                prompt: prompt,
                data: data
            });
            // pre-check
            spyOn(prompt, 'onPromptOk').and.callThrough();
            spyOn(fixture.componentRef, 'destroy').and.callThrough();
            // act
            component.accept();
            component.accept();
            // assert
            expect(prompt.onPromptOk.calls.count()).toEqual(1);
            tick();
        })
    );

    it('should remove component reference on accept button even if no prompt defined',
        fakeAsync(() => {
            component = fixture.componentInstance;
            component.dialogInit(fixture.componentRef, {
                title: sampleText,
                data: data
            });
            // pre-check
            spyOn(fixture.componentRef, 'destroy').and.callThrough();
            // act
            component.accept();
            // assert
            tick();
            expect(fixture.componentRef.destroy).toHaveBeenCalled();
        })
    );

    it('should call onPromptCancel callback on decline button and remove component reference after',
        fakeAsync(() => {
            component = fixture.componentInstance;
            component.dialogInit(fixture.componentRef, {
                title: sampleText,
                prompt: prompt,
                data: data
            });
            // pre-check
            spyOn(prompt, 'onPromptCancel').and.callThrough();
            spyOn(fixture.componentRef, 'destroy').and.callThrough();
            // act
            component.decline();
            // assert
            expect(prompt.onPromptCancel).toHaveBeenCalled();
            tick();
            expect(fixture.componentRef.destroy).toHaveBeenCalled();
        })
    );

    it('should not remove component if promptCancel fails and show alert', fakeAsync(() => {
        component = fixture.componentInstance;
        component.dialogInit(fixture.componentRef, {
            title: sampleText,
            prompt: prompt,
            data: data
        });
        prompt.onPromptCancel = () => new Promise<string>((resolve: any, reject: any) => {
            reject();
        });
        fixture.detectChanges();
        let modalDialog = fixture.nativeElement.querySelector('.modal-content');
        // pre-check
        spyOn(fixture.componentRef, 'destroy').and.callThrough();
        // act
        component.decline();
        // assert
        tick();
        fixture.detectChanges();
        expect(modalDialog.className).toMatch(/shake/);
        jasmine.clock().tick(300);
        fixture.detectChanges();
        expect(modalDialog.className).not.toMatch(/shake/);

        expect(fixture.componentRef.destroy).not.toHaveBeenCalled();
    }));

    it('should call onPromptCancel once if previous didn`t finish', fakeAsync(() => {
        component = fixture.componentInstance;
        component.dialogInit(fixture.componentRef, {
            title: sampleText,
            prompt: prompt,
            data: data
        });
        // pre-check
        spyOn(prompt, 'onPromptCancel').and.callThrough();
        // act
        component.decline();
        component.decline();
        // assert
        expect(prompt.onPromptCancel.calls.count()).toEqual(1);
        tick();
    }));

    it('should remove component reference on decline button even if no prompt defined', fakeAsync(() => {
        component = fixture.componentInstance;
        component.dialogInit(fixture.componentRef, {
            title: sampleText,
            data: data
        });
        // pre-check
        spyOn(fixture.componentRef, 'destroy').and.callThrough();
        // act
        component.decline();
        // assert
        tick();
        expect(fixture.componentRef.destroy).toHaveBeenCalled();
    }));

    it('should call onPromptCancel callback on close button if defined',
        fakeAsync(() => {
            component = fixture.componentInstance;
            component.dialogInit(fixture.componentRef, {
                title: sampleText,
                prompt: prompt,
                data: data
            });
            // pre-check
            spyOn(prompt, 'onPromptCancel').and.callThrough();
            spyOn(fixture.componentRef, 'destroy').and.callThrough();
            // act
            component.close();
            // assert
            expect(prompt.onPromptCancel).toHaveBeenCalled();
            tick();
            expect(fixture.componentRef.destroy).toHaveBeenCalled();
        })
    );

    it('should not destroy component on onPromptCancel callback if response failed',
        fakeAsync(() => {
            component = fixture.componentInstance;
            component.dialogInit(fixture.componentRef, {
                title: sampleText,
                prompt: prompt,
                data: data
            });
            prompt.onPromptCancel = () => new Promise<string>((resolve: any, reject: any) => {
                reject();
            });
            // pre-check
            spyOn(prompt, 'onPromptCancel').and.callThrough();
            spyOn(fixture.componentRef, 'destroy').and.callThrough();
            // act
            component.close();
            // assert
            expect(prompt.onPromptCancel).toHaveBeenCalled();
            tick();
            expect(fixture.componentRef.destroy).not.toHaveBeenCalled();
        })
    );

    it('should not call onPromptCancel twice if first not finished yet',
        fakeAsync(() => {
            component = fixture.componentInstance;
            component.dialogInit(fixture.componentRef, {
                title: sampleText,
                prompt: prompt,
                data: data
            });
            // pre-check
            spyOn(prompt, 'onPromptCancel').and.callThrough();
            // act
            component.close();
            component.close();
            // assert
            expect(prompt.onPromptCancel.calls.count()).toEqual(1);
            tick();
        })
    );

    it('should call onClose callback on close button if onPromptCancel not defined',
        fakeAsync(() => {
            component = fixture.componentInstance;
            let input = {
                title: sampleText,
                onClose: onClose,
                data: data
            };
            component.dialogInit(fixture.componentRef, input);
            // pre-check
            spyOn(component, 'onClose').and.callThrough();
            // act
            component.close();
            // assert
            tick();
            expect(component.onClose).toHaveBeenCalled();
        })
    );

    it('should remove reference on close button',
        fakeAsync(() => {
            component = fixture.componentInstance;
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
        let component = fixture.componentInstance;

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
});
