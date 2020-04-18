import { Component, OnInit } from '@angular/core';
import { sharedService } from '../../providers/shared.service';
import { remote } from 'electron';
let { dialog } = remote;

import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable.js';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  constructor(
    public _sharedService: sharedService,
  ) {
    if( !this._sharedService.endpoints ) {
      this._sharedService.endpoints = [];
    }
  }

  ngOnInit() {
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
      this._sharedService.removeOne(endpointId);
    }
  }
}
