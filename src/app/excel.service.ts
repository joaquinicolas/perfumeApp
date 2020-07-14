import { Injectable, Component } from '@angular/core';
import { remote } from "electron";

import Fragancia, { Components } from "../models/fragancia";

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  private basepath: string;
  constructor() {
    this.basepath = remote.app.getAppPath();
  }

  readData() {
    
  }
}

