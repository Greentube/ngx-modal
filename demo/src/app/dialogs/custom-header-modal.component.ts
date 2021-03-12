import {Component} from '@angular/core';
import {IModalHeaderDialog} from 'ngx-modal-dialog';

@Component({
  selector: 'app-custom-header-modal',
  template: `
    <h4>This component is a custom header</h4>
    <p>Written By: <b>{{title}}</b></p>
  `
})
export class CustomHeaderModalComponent implements IModalHeaderDialog {
  title: string;

  setData(data: any) {
    this.title = data['title'];
  }
}
