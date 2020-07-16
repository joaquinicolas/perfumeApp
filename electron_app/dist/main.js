"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const electron_1 = require("electron");
const url = require("url");
const path = require("path");
const typeorm_1 = require("typeorm");
const api_1 = require("./api");
const Fragancia_1 = require("./entity/Fragancia");
const FraganciaCommodity_1 = require("./entity/FraganciaCommodity");
const Commodity_1 = require("./entity/Commodity");
let win;
function createWindow() {
    win = new electron_1.BrowserWindow({
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
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
electron_1.ipcMain.on('getFragancias', () => {
    return DB.init()
        .then(connection => api_1.API.getFragancias(connection))
        .then(fragments => {
        win.webContents.send('getFragancias', fragments);
    })
        .catch(err => console.error(err));
});
const DB = {
    init: () => {
        return typeorm_1.createConnection({
            type: "sqlite",
            database: path.resolve(__dirname, '../../db.sqlite'),
            synchronize: true,
            logging: false,
            entities: [
                Fragancia_1.Fragancia,
                FraganciaCommodity_1.FraganciaCommodity,
                Commodity_1.Commodity
            ],
        });
    },
};
//# sourceMappingURL=main.js.map