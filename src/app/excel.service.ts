import {Injectable} from '@angular/core';
import {remote, ipcRenderer} from 'electron';
import {Fragancia} from './home/home.component';
import {BehaviorSubject, Observable} from 'rxjs';
import {Commodity} from './detail/detail.component';


@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  basepath: string;
  fraganciasSubject: BehaviorSubject<Fragancia[]>;
  gotFragancias: Observable<Fragancia[]>;
  commoditiesSubject: BehaviorSubject<Commodity[]>;
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
      res.forEach((value) => {
        value.totalQuantity = value.Components.reduce(
          (prev, cur) => prev + cur.Quantity,
          0
        );
      });
      this.fraganciasSubject.next(f);
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

    ipcRenderer.on(AppEvents.CommodityById, (event, args) => {
      const commodity = args as Commodity;
      this.CommoditySubj.next(commodity);
    });
  }

  ComponentById(_id: any): void {
    ipcRenderer.send(AppEvents.CommodityById, _id);
  }

  readData() {
    ipcRenderer.send(AppEvents.ReadFragancias, {});
  }

  saveChanges(fragancia: Fragancia, cb: () => void) {
    ipcRenderer.send(AppEvents.SaveFragancias, fragancia);
    ipcRenderer.on(AppEvents.SaveFragancias, cb);
  }

  readCommodities() {
    ipcRenderer.send(AppEvents.ReadCommodities, {});
  }

  downloadCommodities() {
    ipcRenderer.send('downloadCommodities');
  }

exportFragancias(){
    ipcRenderer.send(AppEvents.ExportFragancias);
}

  updateCommodity(commodity: Commodity) {
    ipcRenderer.send(AppEvents.UpdateCommodity, commodity);
  }

  uploadFile(cb: () => void) {
    ipcRenderer.send(AppEvents.UploadFile);
    ipcRenderer.on(AppEvents.UploadFile, cb);
  }

  updateFragancia(f: Fragancia, cb: () => void) {
    ipcRenderer.send(AppEvents.UpdateFragancia, f);
    ipcRenderer.on(AppEvents.UpdateFragancia, cb);
  }
}

export enum AppEvents {
  ReadCommodities = 'getCommodities',
  SaveCommodity = 'saveCommodity',
  ReadFragancias = 'getFragancias',
  SaveFragancias = 'saveChanges',
  CommodityById = 'commodityById',
  UploadFile = 'uploadFile',
  UpdateFragancia = 'updateFragancia',
  UpdateCommodity = 'updateCommodity',
  ExportFragancias = 'exportFragancias'
}
