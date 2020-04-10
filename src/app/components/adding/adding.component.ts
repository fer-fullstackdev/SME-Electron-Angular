import { Component, OnInit } from '@angular/core';
import { sharedService } from '../../providers/shared.service';
import { remote } from 'electron';
let { dialog } = remote;
import * as _ from 'lodash';

@Component({
  selector: 'app-adding',
  templateUrl: './adding.component.html',
  styleUrls: ['./adding.component.scss']
})
export class AddingComponent implements OnInit {
  public name: string;
  public url: string;

  constructor(
    private _sharedService: sharedService,
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  addEndpoint() {
    if( !this.name || !this.url ) {
      dialog.showMessageBox(remote.getCurrentWindow(), {
        type: 'warning',
        buttons: ['OK'],
        title: 'Confirm',
        message: 'Please enter all input fields!'
      });
    } else {
      if( _.includes(this.url, 'https://') || _.includes(this.url, 'http://') ) {
        this._sharedService.addOneEndpoint(this.name, this.url);
        this._sharedService.endpoints = this._sharedService.getAllEndpoints();
        this.closeDlg();
      } else {
        dialog.showMessageBox(remote.getCurrentWindow(), {
          type: 'warning',
          buttons: ['OK'],
          title: 'Confirm',
          message: 'Full URL path is needed!'
        });
      }
    }
  }

  closeDlg() {
    this._sharedService.isHomePage = true;
    this._sharedService.addingDlgRef.close();
  }
}
