import {Injectable, Component} from '@angular/core';
import {remote, ipcRenderer} from 'electron';
import {Fragancia} from './home/home.component';
import {BehaviorSubject, Observable} from 'rxjs';


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

    ipcRenderer.on('saveChanges', (event, args) => {
      if (args instanceof Error) {
        // Gets an error
        // TODO: show a modal
        console.error(args);
      } else {
        const fragancia = <Fragancia> args;
        this.fraganciasSubject.next(
          this.fraganciasSubject.value.map(value => value.id === fragancia.id ? fragancia : value)
        );
      }
      console.log('Changes saved successfully');
    });
  }

  private findFragancia(id: number): Fragancia {
    return this.fraganciasSubject.value.find(value => value.id === id);
  }

  get gotFraganciasValue() {
    return this.fraganciasSubject.value;
  }

  readData() {
    ipcRenderer.send('getFragancias', {});
  }

  saveChanges(fragancia: Fragancia) {
    ipcRenderer.send('saveChanges', fragancia);
  }
}

