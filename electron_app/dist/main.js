"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("reflect-metadata");
const electron_1 = require("electron");
const url = require("url");
const path = require("path");
const typeorm_1 = require("typeorm");
const api_1 = require("./api");
const Fragancia_1 = require("./entity/Fragancia");
const FraganciaCommodity_1 = require("./entity/FraganciaCommodity");
const Commodity_1 = require("./entity/Commodity");
const fs = require("fs");
var AppEvents;
(function (AppEvents) {
    AppEvents["ReadCommodities"] = "getCommodities";
    AppEvents["SaveCommodities"] = "saveCommodities";
    AppEvents["ReadFragancias"] = "getFragancias";
    AppEvents["SaveFragancias"] = "saveChanges";
})(AppEvents || (AppEvents = {}));
let dbPath = '/opt/fragancias';
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
        console.log(fragments);
        win.webContents.send('getFragancias', fragments);
    })
        .catch(err => console.error(err));
});
electron_1.ipcMain.on('saveChanges', (event, args) => {
    return DB.init()
        .then(connection => api_1.API.saveChanges(args))
        .then(f => {
        win.webContents.send('saveChanges', f);
    })
        .catch(err => {
        console.log(err);
        win.webContents.send('saveChanges', err);
    });
});
electron_1.ipcMain.on(AppEvents.ReadCommodities, (event, args) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const conn = yield DB.init();
    try {
        const commodities = yield api_1.API.getCommodities(conn);
        win.webContents.send(AppEvents.ReadCommodities, commodities);
    }
    catch (e) {
        console.log(e);
        win.webContents.send(AppEvents.ReadCommodities, e);
    }
}));
electron_1.ipcMain.on(AppEvents.SaveCommodities, (event, args) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield DB.init();
    try {
        const commodity = yield api_1.API.saveCommodity(args);
        win.webContents.send(AppEvents.SaveCommodities, commodity);
    }
    catch (e) {
        console.log(e);
        win.webContents.send(AppEvents.SaveCommodities, e);
    }
}));
const DB = {
    init: () => {
        let result;
        if (!typeorm_1.getConnectionManager().has('default')) {
            result = typeorm_1.createConnection({
                type: 'sqlite',
                database: path.resolve(dbPath, 'db.sqlite'),
                synchronize: true,
                logging: false,
                entities: [
                    Fragancia_1.Fragancia,
                    FraganciaCommodity_1.FraganciaCommodity,
                    Commodity_1.Commodity
                ],
            })
                .then(connection => {
                return Promise.resolve(connection);
            });
        }
        else {
            result = Promise.resolve(typeorm_1.getConnection());
        }
        return result;
    },
};
//# sourceMappingURL=main.js.map