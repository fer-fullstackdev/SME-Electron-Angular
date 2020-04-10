import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { sharedService } from '../../providers/shared.service';
import { AddingComponent } from '../adding/adding.component';
import { SettingComponent } from '../setting/setting.component';
import { MatDialog } from '@angular/material/dialog';
import { remote, shell } from 'electron';
let { dialog, screen } = remote;
import * as _ from 'lodash';

import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable.js';

var that;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public isOpenedEPExist: boolean = false;
  public openedArr: any;
  public screenHeight: any;

  @ViewChild('container') container: ElementRef;
  constructor(
    private elementRef: ElementRef,
    public renderer: Renderer2,
    public _sharedService: sharedService,
    public mdDialog: MatDialog
  ) {
  }

  ngOnInit() {
    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;
    this.screenHeight = size.height;
    /*
    document.onmousedown = disableRightclick;
    function disableRightclick(evt){
      if(evt.button == 2){
        return false;
      }
    }
    */
    that = this;
    this.openedArr = [];

    // window.localStorage.clear();
    if( this._sharedService.getAllEndpoints() ) {
      this._sharedService.checkEndpoint = true;
    } else {
      this._sharedService.checkEndpoint = false;
    }

    // Prevent default action of right click in chromium. Replace with our menu.
    window.addEventListener('contextmenu', (e) => {
      /*
      if( !this._sharedService.curOpenedId || !this._sharedService.isHomePage ) {
        return;
      }
      e.preventDefault();

      var curWebView = that.elementRef.nativeElement.querySelector("#id_" + that._sharedService.curOpenedId);
      let menu = new Menu();
      menu.append(new MenuItem ({
        label: 'Back',
        enabled: curWebView.canGoBack(),
        click() {
          curWebView.goBack();
        }
      }));
      menu.append(new MenuItem ({
        label: 'Forward',
        enabled: curWebView.canGoForward(),
        click() {
          curWebView.goForward();
        }
      }));
      menu.popup(remote.getCurrentWindow());
      */
    }, false);
  }

  ngAfterViewInit() {
    ($('#ed_list') as any).sortable();
  }

  goAdding() {
    this._sharedService.addingDlgRef = this.mdDialog.open(AddingComponent, {
      width: '900px',
      height: (this.screenHeight - 72 - 15) + 'px',
      disableClose: true,
      data: {}
    });
    this._sharedService.isHomePage = false;

    this._sharedService.addingDlgRef.afterClosed().subscribe(result => {
      console.log('The adding dialog was closed');
    });
  }

  goBack() {
    if( !that._sharedService.curOpenedId || !that._sharedService.isHomePage ) {
      return;
    }
    var curWebView = that.elementRef.nativeElement.querySelector("#id_" + that._sharedService.curOpenedId);
    if(curWebView.canGoBack()) {
      curWebView.goBack();
    }
  }

  goForward() {
    if( !that._sharedService.curOpenedId || !that._sharedService.isHomePage ) {
      return;
    }
    var curWebView = that.elementRef.nativeElement.querySelector("#id_" + that._sharedService.curOpenedId);
    if(curWebView.canGoForward()) {
      curWebView.goForward();
    }
  }

  goSetting() {
    this._sharedService.settingDlgRef = this.mdDialog.open(SettingComponent, {
      width: '900px',
      height: (this.screenHeight - 72 - 15) + 'px',
      disableClose: true,
      data: {}
    });
    this._sharedService.isHomePage = false;

    this._sharedService.settingDlgRef.afterClosed().subscribe(result => {
      console.log('The setting dialog was closed');
    });
  }

  openEndpoint(endpoint: any) {
    if( this.isOpenedEPExist ) {
      if( this._sharedService.curOpenedId != endpoint.id ) {
        this.renderer.setStyle(this.elementRef.nativeElement.querySelector(".webview" + this._sharedService.curOpenedId), 'display', 'none');
        if( _.includes(this.openedArr, endpoint.id) ) {
          this.renderer.setStyle(this.elementRef.nativeElement.querySelector(".webview" + endpoint.id), 'display', 'flex');
        } else {
          let webviewDiv = document.createElement('div');
          let loadingTxtContent = document.createTextNode('Loading...');
          webviewDiv.setAttribute('class', 'webview' + endpoint.id);
          webviewDiv.appendChild(loadingTxtContent);
          this.elementRef.nativeElement.querySelector('.webview-container').appendChild(webviewDiv);
          let webview = document.createElement('webview');
          webview.setAttribute('id', 'id_' + endpoint.id);
          webview.setAttribute('src', endpoint.url);
          webview.style.display = 'flex';
          webview.style.width = '100%';
          webview.style.height = (this.screenHeight - 22 - 15) + 'px',
          webview.setAttribute('partition', 'persist:' + endpoint.url + endpoint.id);
          console.log('webview: ', webview);
          webview.addEventListener('did-finish-load', function(res) {
            try {
              webviewDiv.removeChild(loadingTxtContent);
            } catch (error) {
              console.log('did-finish-load error: , ', error);
            }
          });
          webview.addEventListener('did-fail-load', function(res) {
            console.log('did-fail-load: ', res)
            if( res.errorCode != -3 && res.errorCode != 0 ) {
              webviewDiv.innerText = 'This endpoint is not available!';
              dialog.showMessageBox(remote.getCurrentWindow(), {
                type: 'warning',
                buttons: ['OK'],
                title: 'Warning',
                message: 'This endpoint is not available.'
              });
            }
          });
          webviewDiv.appendChild(webview);

          this.openedArr.push(endpoint.id);
        }
        this._sharedService.curOpenedId = endpoint.id;
      } else{}
    } else {
      this.isOpenedEPExist = true;
      this._sharedService.curOpenedId = endpoint.id;

      let webviewDiv = document.createElement('div');
      let loadingTxtContent = document.createTextNode('Loading...');
      webviewDiv.setAttribute('class', 'webview' + endpoint.id);
      webviewDiv.appendChild(loadingTxtContent);
      this.elementRef.nativeElement.querySelector('.webview-container').appendChild(webviewDiv);
      let webview = document.createElement('webview');
      webview.setAttribute('id', 'id_' + endpoint.id);
      webview.setAttribute('src', endpoint.url);
      webview.style.display = 'flex';
      webview.style.width = '100%';
      webview.style.height = (this.screenHeight - 22 - 15) + 'px',
      webview.setAttribute('partition', 'persist:' + endpoint.url + endpoint.id);
      console.log('webview: ', webview);
      webview.addEventListener('did-finish-load', function(res) {
        try {
          webviewDiv.removeChild(loadingTxtContent);
        } catch (error) {
          console.log('did-finish-load error: , ', error);
        }

      });
      webview.addEventListener('did-fail-load', function(res) {
        console.log('did-fail-load: ', res)
        if( res.errorCode != -3 && res.errorCode != 0 ) {
          webviewDiv.innerText = 'This endpoint is not available!';
          dialog.showMessageBox(remote.getCurrentWindow(), {
            type: 'warning',
            buttons: ['OK'],
            title: 'Warning',
            message: 'This endpoint is not available.'
          });
        }
      });
      webviewDiv.appendChild(webview);
      this.openedArr.push(endpoint.id);
    }
  }

  onResized(event) {
    if(this._sharedService.curOpenedId) {
      let curSize = [];
      curSize = remote.getCurrentWindow().getSize();
      $('webview').each(function() {
        $( this ).css( 'height', (curSize[1]-22+'px') );
      });
    }
  }

  goEULA() {
    shell.openExternal('https://storagemadeeasy.com/files/dcd799a0f41302e2eb8f80ab501acca6.pdf');
  }

  goTerms() {
    shell.openExternal('https://www.storagemadeeasy.com/terms/');
  }
}
