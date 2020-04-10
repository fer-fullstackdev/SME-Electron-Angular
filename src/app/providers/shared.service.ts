import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class sharedService {
  public endpoints: any;
  public addingDlgRef: any;
  public settingDlgRef: any;
  public checkEndpoint: boolean;
  public curOpenedId: any;
  public isHomePage: boolean = true;
  constructor() {
  }

  getAllEndpoints() {
    let endpoints =  window.localStorage.getItem('endpoints');
    let endpointsArr = endpoints ? JSON.parse( endpoints ) : endpoints;
    this.endpoints = _.orderBy(endpointsArr, [obj => obj.name.toLowerCase()], ['asc']);
    return this.endpoints;
  }

  addOneEndpoint(name: string, url: string) {
    let endpoints =  window.localStorage.getItem('endpoints');
    if( endpoints ) {
      let newArr = [];
      newArr = JSON.parse( endpoints );
      let lastId = _.maxBy(newArr, 'id').id;
      let newObj = { id: lastId + 1, name: name, url: url };
      newArr.push(newObj);
      newArr = _.orderBy(newArr, [obj => obj.name.toLowerCase()], ['asc']);
      window.localStorage.setItem('endpoints', JSON.stringify(newArr));
      this.endpoints = newArr;
    } else {
      let newArr = [];
      let newObj = { id: 1, name: name, url: url };
      newArr.push(newObj);
      newArr = _.orderBy(newArr, [obj => obj.name.toLowerCase()], ['asc']);
      window.localStorage.setItem('endpoints', JSON.stringify(newArr));
      this.endpoints = newArr;
    }
    this.checkEndpoint = true;
  }

  setAllEndpointToStorage(endpoints: any) {
    window.localStorage.setItem('endpoints', endpoints);
  }

  removeOne(id: any) {
    _.remove(this.endpoints, function (one) {
      return one.id === id;
    });
    if( this.endpoints.length ) {
      this.setAllEndpointToStorage(JSON.stringify(this.endpoints));
    } else {
      this.setAllEndpointToStorage([]);
      this.checkEndpoint = false;
    }
  }
}
