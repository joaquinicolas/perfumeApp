import { Injectable, Component } from '@angular/core';
import { remote, ipcRenderer } from "electron";
import { Fragancia } from './home/home.component';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  private basepath: string;
  private fraganciasSubject: BehaviorSubject<Fragancia[]>;
  public gotFragancias: Observable<Fragancia[]>;

  constructor() {
    this.basepath = remote.app.getAppPath();
    this.fraganciasSubject = new BehaviorSubject<Fragancia[]>([]);
    this.gotFragancias = this.fraganciasSubject.asObservable();

    ipcRenderer.on('getFragancias', (event, f) => {
      this.fraganciasSubject.next(f);
    });
  }

  get gotFraganciasValue() {
    return this.fraganciasSubject.value;
  }
  readData() {
    ipcRenderer.send('getFragancias', {});
  }
}

