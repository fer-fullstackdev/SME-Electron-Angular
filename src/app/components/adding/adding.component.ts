import { Component, OnInit, Inject } from '@angular/core';
import { sharedService } from '../../providers/shared.service';
import { remote } from 'electron';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  public imgURL: any = '';
  public displaySetting: number = 1;
  public endpointId: number;

  constructor(
    private _sharedService: sharedService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.endpointId = this.data.endpointId;
    if(this.endpointId) {
      let curEndpoint = this._sharedService.getEndPointById(this.endpointId);
      this.name = curEndpoint.name;
      this.url = curEndpoint.url;
      this.imgURL = curEndpoint.img;
      this.displaySetting = curEndpoint.displaySetting;
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  addEndpoint() {
    if(!this.name || !this.url) {
      dialog.showMessageBox(remote.getCurrentWindow(), {
        type: 'warning',
        buttons: ['OK'],
        title: 'Confirm',
        message: 'Please enter endpoint name and url.'
      });
    } else {
      if(!this.imgURL && (this.displaySetting == 2 || this.displaySetting == 3)) {
        dialog.showMessageBox(remote.getCurrentWindow(), {
          type: 'warning',
          buttons: ['OK'],
          title: 'Confirm',
          message: 'Please select site image.'
        });
      } else {
        if( _.includes(this.url, 'https://') || _.includes(this.url, 'http://') ) {
          if(!this.endpointId)
            this._sharedService.addOneEndpoint(this.name, this.url, this.imgURL, this.displaySetting);
          else
            this._sharedService.updateOneEndpoint(this.endpointId, this.name, this.url, this.imgURL, this.displaySetting);
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
  }

  closeDlg() {
    this._sharedService.isHomePage = true;
    this._sharedService.addingDlgRef.close();
  }

  imgPreview(imageInput) {
    const file: File = imageInput.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file); 
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }
}
