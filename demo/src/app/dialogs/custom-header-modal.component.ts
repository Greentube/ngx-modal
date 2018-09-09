import {Component} from '@angular/core';
import {IModalHeaderDialog} from '../../../../src/modal-dialog.interface';

@Component({
  selector: 'app-custom-header-modal',
  template: `
    <p>This component is a custom header.</p>
    <p>Written By: <b>{{data}}</b></p>
  `
})
export class CustomHeaderModalComponent implements IModalHeaderDialog {
  data: string;

  setData(data: any) {
    this.data = data;
  }
}
