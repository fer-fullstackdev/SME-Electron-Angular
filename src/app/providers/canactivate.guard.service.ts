import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;

@Injectable()
export class CanActivateGuard implements CanActivate, CanActivateChild {
  constructor(public router: Router) {}

  canActivate() {
    console.log('i am checking to see if you are logged in');
    return true;
  }

  canActivateChild() {
    console.log('checking child route access');
    return true;
  }

}
