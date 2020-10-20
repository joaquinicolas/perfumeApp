import { Injectable, Component } from '@angular/core';
import { remote, ipcRenderer } from 'electron';
import { Fragancia } from './home/home.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { Commodity } from './detail/detail.component';


export enum AppEvents {
  ReadCommodities = 'getCommodities',
  SaveCommodity = 'saveCommodity',
  ReadFragancias = 'getFragancias',
  SaveFragancias = 'saveChanges',
  CommodityById = "commodityById"
}

@Injectable({
  providedIn: 'root',
})
export class ExcelService {

  private basepath: string;
  private fraganciasSubject: BehaviorSubject<Fragancia[]>;
  public gotFragancias: Observable<Fragancia[]>;
  private commoditiesSubject: BehaviorSubject<Commodity[]>;
  gotCommodities: Observable<Commodity[]>;
  Commodity$: Observable<Commodity>;
  CommoditySubj: BehaviorSubject<Commodity>;

  constructor() {
    this.basepath = remote.app.getAppPath();
    this.fraganciasSubject = new BehaviorSubject<Fragancia[]>([]);
    this.gotFragancias = this.fraganciasSubject.asObservable();
    this.commoditiesSubject = new BehaviorSubject<Commodity[]>([]);
    this.gotCommodities = this.commoditiesSubject.asObservable();
    this.CommoditySubj = new BehaviorSubject<Commodity>(null);
    this.Commodity$ = this.CommoditySubj.asObservable();

    ipcRenderer.on(AppEvents.ReadFragancias, (event, f) => {
      if (!f) {
        f = [];
      }
      const res = f as Fragancia[];
      res.forEach(value => {
        value.totalQuantity = value.Components.reduce((prev, cur) => prev + cur.Quantity, 0);
      });
      this.fraganciasSubject.next(f);
    });

    ipcRenderer.on(AppEvents.SaveFragancias, (event, args) => {
      const fragancia = args as Fragancia;
      this.fraganciasSubject.next(
        this.fraganciasSubject.value.map((value) =>
          value.Description === fragancia.Description ? fragancia : value
        )
      );
    });

    ipcRenderer.on(AppEvents.ReadCommodities, (event, args) => {
      this.commoditiesSubject.next(args);
    });

    ipcRenderer.on(AppEvents.SaveCommodity, (event, args) => {
      const commodity = args as Commodity;
      this.commoditiesSubject.next(
        this.commoditiesSubject.value.map((value) =>
          value.Description === commodity.Description ? commodity : value
        )
      );
    });
  }

  ComponentById(_id: any): void {
    ipcRenderer.send(AppEvents.CommodityById, _id);
  }
  readData() {
    ipcRenderer.send(AppEvents.ReadFragancias, {});
  }

  saveChanges(fragancia: Fragancia) {
    ipcRenderer.send(AppEvents.SaveFragancias, fragancia);
  }

  readCommodities() {
    ipcRenderer.send(AppEvents.ReadCommodities, {});
  }

  saveCommodity(commodity: Commodity) {
    ipcRenderer.send(AppEvents.SaveCommodity, commodity);
  }
}
