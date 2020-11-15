import 'reflect-metadata';
import {app, BrowserWindow, ipcMain, dialog} from 'electron';
import * as url from 'url';
import * as path from 'path';
import {API} from './api';
import * as fs from 'fs';
import * as Datastore from 'nedb';
import {Spreadsheet} from './excel';
import {AppEvents, FileStatus} from "./constant";
import {combineAll, concat, concatAll, mapTo, mergeAll} from "rxjs/operators";
import {from} from "rxjs";

enum FileStatusMessages {
  Ok = 'Materias primas almacenadas exitosamente',
  Error = 'Material primas no pudieron ser almacenadas'
}

const fraganciasFolder = 'fragancias';
let dbPath = path.resolve(userHome(), fraganciasFolder);
let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 600,
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL(
    url.format({
      pathname: path.resolve(__dirname, '../../dist/index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});


ipcMain.on(AppEvents.UploadFile, async (event: any) => {
  const res = await dialog.showOpenDialog(win, {
    properties: ['openFile'],
    filters: [{name: 'Custom File Type', extensions: ['xlsx', 'xls']}],
  });

  if (res.canceled) {
    win.webContents.send(AppEvents.UploadFile, '');
  } else {
    try {
      const store = new Store();
      const api = new API(store);
      const spreadsheetAPI = new Spreadsheet();
      const commodities = await spreadsheetAPI.readCommoditiesFile(res.filePaths[0]);
      for (let i = 0; i < commodities.length; i++) {
        const element = commodities[i];
        await api.saveCommodity(element);
      }
      win.webContents.send(AppEvents.UploadFile, FileStatus.Ok);
    } catch (err) {
      showErrorDialog(err);
      win.webContents.send(AppEvents.UploadFile, FileStatus.Error);
    }
  }
});
ipcMain.on(AppEvents.ReadFragancias, async () => {
  const store = new Store();
  const api = new API(store);
  try {
    let fragancias = await api.getFragancias();
    win.webContents.send(AppEvents.ReadFragancias, fragancias);
  } catch (error) {
    showErrorDialog(error);
  }
});
ipcMain.on(AppEvents.DownloadCommodities, async (event, args) => {
  const store = new Store();
  const api = new API(store);
  try {
    let commodities = await api.getCommodities();
    const spreadsheet = new Spreadsheet();
    await spreadsheet.newCommoditiesWorkbook(commodities, dbPath);
    win.webContents.send(AppEvents.DownloadCommodities);
    showMessageBox('Archivo almacenado exitosamente');
  } catch (e) {
    showErrorDialog(e);
  }
});
ipcMain.on(AppEvents.UpdateFragancia, async (event, args) => {
  const api = new API(new Store());
  try {
    let f = await api.updateFragancia(args);
    await showMessageBox('Operacion exitosa');
    win.webContents.send(AppEvents.UpdateFragancia);
  } catch (e) {
    showErrorDialog(e);
  }
});
ipcMain.on(AppEvents.SaveFragancias, async (event, args) => {
  const api = new API(new Store());
  try {
    let newFrag = await api.saveFragancia(args);
    await showMessageBox('Fragancia almacenada exitosamente');
    win.webContents.send(AppEvents.SaveFragancias);
  } catch (e) {
    showErrorDialog(e);
  }
});

ipcMain.on(AppEvents.ReadCommodities, async (event, args) => {
  const api = new API(new Store());
  try {
    let commodities = await api.getCommodities();
    win.webContents.send(AppEvents.ReadCommodities, commodities);
  } catch (e) {
    showErrorDialog(e);
  }
});

ipcMain.on(AppEvents.UpdateCommodity, async (event, args) => {
  const api = new API(new Store());
  try {
    let newComm = await api.updateCommodity(args);
    await showMessageBox('Operacion exitosa');
    win.webContents.send(AppEvents.SaveCommodity, newComm);
  } catch (e) {
    showErrorDialog(e);
  }
});

ipcMain.on(AppEvents.CommodityById, async (event, args) => {
  const api = new API(new Store());
  try {
    api
      .CommodityById(args)
      .subscribe((x) => win.webContents.send(AppEvents.CommodityById, x));
  } catch (e) {
    showErrorDialog(e);
  }
});

export class Store {
  db: {
    fragancias: Nedb<any>;
    commodities: Nedb<any>;
  };
  static instance: Store;

  constructor() {
    if (typeof Store.instance === 'object') {
      return Store.instance;
    }

    try {
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath);
      }
      this.db = {
        fragancias: new Datastore(path.resolve(dbPath, 'fragancias.db')),
        commodities: new Datastore(path.resolve(dbPath, 'commodities.db')),
      };
      this.db.fragancias.loadDatabase();
      this.db.commodities.loadDatabase();
    } catch (error) {
      showErrorDialog(error);
      throw error;
    }
    Store.instance = this;
    return this;
  }
}

function showErrorDialog(msg: string) {
  const title = 'Ocurrio un error';
  return dialog.showErrorBox(title, msg.toString());
}

function showMessageBox(message: string): Promise<Electron.MessageBoxReturnValue> {
  const title = 'Accion exitosa';
  const type = 'info';
  const buttons = ['Entiendo'];

  return dialog.showMessageBox(win, {
    title,
    message,
    type,
    buttons,
  });
}

function userHome(): string {
  const linuxHome = 'HOME';
  const win32Home = 'USERPROFILE';
  return process.env[process.platform == 'win32' ? win32Home : linuxHome];
}
