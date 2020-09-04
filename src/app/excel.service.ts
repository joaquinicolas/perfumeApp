import {Injectable, Component} from '@angular/core';
import {remote, ipcRenderer} from 'electron';
import {Fragancia} from './home/home.component';
import {BehaviorSubject, Observable} from 'rxjs';
import {Commodity} from './detail/detail.component';


const readCommodities = 'getCommodities';
const saveCommodities = 'saveCommodities';
const readFragancias = 'getFragancias';
const saveFragancias = 'saveChanges';


@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  private basepath: string;
  private fraganciasSubject: BehaviorSubject<Fragancia[]>;
  public gotFragancias: Observable<Fragancia[]>;
  private commoditySubject: BehaviorSubject<Commodity[]>;
  gotCommodities: Observable<Commodity[]>;

  constructor() {
    this.basepath = remote.app.getAppPath();
    this.fraganciasSubject = new BehaviorSubject<Fragancia[]>([]);
    this.gotFragancias = this.fraganciasSubject.asObservable();
    this.commoditySubject = new BehaviorSubject<Commodity[]>([]);
    this.gotCommodities = this.commoditySubject.asObservable();

    ipcRenderer.on(readFragancias, (event, f) => {
      this.fraganciasSubject.next(f);
    });

    ipcRenderer.on(saveFragancias, (event, args) => {
      if (args instanceof Error) {
        // Gets an error
        // TODO: show a modal
        console.error(args);
      } else {
        const fragancia = args as Fragancia;
        this.fraganciasSubject.next(
          this.fraganciasSubject.value.map(value => value.Description === fragancia.Description ? fragancia : value)
        );
      }
      console.log('Changes saved successfully');
    });

    ipcRenderer.on(readCommodities, (event, args) => {
      this.commoditySubject.next(args);
    });

    ipcRenderer.on(saveCommodities, (event, args) => {
      if (args instanceof Error) {
        // TODO: show modal.
        console.error(args);
      } else {
        const commodity = args as Commodity;
        this.commoditySubject.next(
          this.commoditySubject.value.map(value => value.Description === commodity.Description ? commodity : value)
        );
      }
    });
  }

  readData() {
    ipcRenderer.send(readFragancias, {});
  }

  saveChanges(fragancia: Fragancia) {
    ipcRenderer.send(saveFragancias, fragancia);
  }

  readCommodities() {
    ipcRenderer.send(readCommodities, {});
  }

  saveCommodity(commodity: Commodity) {
    ipcRenderer.send(saveCommodities, commodity);
  }
}

