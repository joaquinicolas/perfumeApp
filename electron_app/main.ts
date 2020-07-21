import 'reflect-metadata';
import {app, BrowserWindow, ipcMain} from 'electron';
import * as url from 'url';
import * as path from 'path';
import {Connection, createConnection} from 'typeorm';
import {API} from './api';
import {Fragancia} from './entity/Fragancia';
import {FraganciaCommodity} from './entity/FraganciaCommodity';
import {Commodity} from './entity/Commodity';

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
      win.webContents.send('getFragancias', fragments);
    })
    .catch(err => console.error(err));
});

ipcMain.on('saveChanges', (event, args) => {
  return DB.init()
    .then(connection => API.saveChanges(connection, args))
    .then(f => {
      win.webContents.send('saveChanges', f);
    })
    .catch(err => {
      console.log(err);
      win.webContents.send('saveChanges', err);
    });
});

const DB = {
  connection: null,
  init: (): Promise<Connection> => {
    let result = Promise.resolve(this.connection);
    if (!this.connection) {
      result = createConnection({
        type: 'sqlite',
        database: path.resolve(__dirname, '../../db.sqlite'),
        synchronize: true,
        logging: false,
        entities: [
          Fragancia,
          FraganciaCommodity,
          Commodity
        ],
      })
        .then(connection => {
          this.connection = connection;
          return Promise.resolve(connection);
        });
    }

    return result;
  },
};
