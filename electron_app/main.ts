import 'reflect-metadata';
import {app, BrowserWindow, ipcMain} from 'electron';
import * as url from 'url';
import * as path from 'path';
import {Connection, createConnection, getConnection, getConnectionManager} from 'typeorm';
import {API} from './api';
import {Fragancia} from './entity/Fragancia';
import {FraganciaCommodity} from './entity/FraganciaCommodity';
import {Commodity} from './entity/Commodity';
import * as fs from 'fs';

enum AppEvents {
  ReadCommodities = 'getCommodities',
  SaveCommodities = 'saveCommodities',
  ReadFragancias = 'getFragancias',
  SaveFragancias = 'saveChanges',
}

let dbPath = '/opt/fragancias';
let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 600,
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: true
    },
  });

  win.loadURL(url.format({
    pathname: path.resolve(__dirname, '../../dist/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  if (process.platform === 'win32') {
    dbPath = path.resolve('C://fragancias');
  }

  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath);
  }
  win.webContents.openDevTools();

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

ipcMain.on('getFragancias', () => {
  return DB.init()
    .then(connection => API.getFragancias(connection))
    .then(fragments => {
      console.log(fragments);
      win.webContents.send('getFragancias', fragments);
    })
    .catch(err => console.error(err));
});

ipcMain.on('saveChanges', (event, args) => {
  return DB.init()
    .then(connection => API.saveChanges(args))
    .then(f => {
      win.webContents.send('saveChanges', f);
    })
    .catch(err => {
      console.log(err);
      win.webContents.send('saveChanges', err);
    });
});

ipcMain.on(AppEvents.ReadCommodities, async (event, args) => {
  const conn = await DB.init();
  try {
    const commodities = await API.getCommodities(conn);
    win.webContents.send(AppEvents.ReadCommodities, commodities);
  } catch (e) {
    console.log(e);
    win.webContents.send(AppEvents.ReadCommodities, e);
  }
});

ipcMain.on(AppEvents.SaveCommodities, async (event, args) => {
  await DB.init();
  try {
    const commodity = await API.saveCommodity(args);
    win.webContents.send(AppEvents.SaveCommodities, commodity);
  } catch (e) {
    console.log(e);
    win.webContents.send(AppEvents.SaveCommodities, e);
  }
});

const DB = {
  init: (): Promise<Connection> => {
    let result;
    if (!getConnectionManager().has('default')) {
      result = createConnection({
        type: 'sqlite',
        database: path.resolve(dbPath, 'db.sqlite'),
        synchronize: true,
        logging: false,
        entities: [
          Fragancia,
          FraganciaCommodity,
          Commodity
        ],
      })
        .then(connection => {
          return Promise.resolve(connection);
        });
    } else {
      result = Promise.resolve(getConnection());
    }

    return result;
  },
};
