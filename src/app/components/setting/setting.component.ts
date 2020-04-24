import { Component, OnInit } from '@angular/core';
import { sharedService } from '../../providers/shared.service';
import { remote } from 'electron';
import { MatDialog } from '@angular/material/dialog';
import { AddingComponent } from '../adding/adding.component';
let { dialog, screen } = remote;

import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable.js';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  public screenHeight: any;

  constructor(
    public _sharedService: sharedService,
    public mdDialog: MatDialog,
  ) {
    if( !this._sharedService.endpoints ) {
      this._sharedService.endpoints = [];
    }
  }

  ngOnInit() {
    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;
    this.screenHeight = size.height;
  }

  ngAfterViewInit() {
    ($('#ed_list1') as any).sortable();
  }

  closeDlg() {
    this._sharedService.isHomePage = true;
    this._sharedService.settingDlgRef.close();
  }

  removeOne(endpointId: any) {
    if( endpointId == this._sharedService.curOpenedId ) {
      dialog.showMessageBox(remote.getCurrentWindow(), {
        type: 'warning',
        buttons: ['OK'],
        title: 'Warning!',
        message: 'You can not remove currently selected endpoint!'
      });
    } else {
      let options  = {
        type: 'question',
        buttons: ['Yes', 'No'],
        message: 'Do you really want to remove?'
       }
       dialog.showMessageBox(remote.getCurrentWindow(), options)
        .then(res => {
          if(res.response == 0) {
            this._sharedService.removeOne(endpointId);
          } else {
            return;
          }
        });
    }
  }

  editOne(endpointId: any) {
    if( endpointId == this._sharedService.curOpenedId ) {
      dialog.showMessageBox(remote.getCurrentWindow(), {
        type: 'warning',
        buttons: ['OK'],
        title: 'Warning!',
        message: 'You can not edit currently selected endpoint!'
      });
    } else {
      this._sharedService.addingDlgRef = this.mdDialog.open(AddingComponent, {
        width: '900px',
        height: (this.screenHeight - 72 - 15) + 'px',
        disableClose: true,
        data: {endpointId: endpointId}
      });
      this._sharedService.isHomePage = false;
    }
  }
}
