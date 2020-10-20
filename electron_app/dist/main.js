"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("reflect-metadata");
const electron_1 = require("electron");
const url = require("url");
const path = require("path");
const api_1 = require("./api");
const fs = require("fs");
const Datastore = require("nedb");
var AppEvents;
(function (AppEvents) {
    AppEvents["ReadCommodities"] = "getCommodities";
    AppEvents["SaveCommodity"] = "saveCommodity";
    AppEvents["ReadFragancias"] = "getFragancias";
    AppEvents["SaveFragancias"] = "saveChanges";
    AppEvents["CommodityById"] = "commodityById";
})(AppEvents = exports.AppEvents || (exports.AppEvents = {}));
const fraganciasFolder = 'fragancias';
let dbPath = path.resolve(userHome(), fraganciasFolder);
let win;
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 600,
        height: 600,
        backgroundColor: '#ffffff',
        webPreferences: {
            nodeIntegration: true,
        },
    });
    win.loadURL(url.format({
        pathname: path.resolve(__dirname, '../../dist/index.html'),
        protocol: 'file:',
        slashes: true,
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
electron_1.ipcMain.on(AppEvents.ReadFragancias, () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const store = new Store();
    const api = new api_1.API(store);
    try {
        let fragancias = yield api.getFragancias();
        win.webContents.send(AppEvents.ReadFragancias, fragancias);
    }
    catch (error) {
        showErrorDialog(error);
    }
}));
electron_1.ipcMain.on(AppEvents.SaveFragancias, (event, args) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const api = new api_1.API(new Store());
    try {
        let newFrag = yield api.saveFragancia(args);
        win.webContents.send(AppEvents.SaveFragancias);
    }
    catch (e) {
        showErrorDialog(e);
    }
}));
electron_1.ipcMain.on(AppEvents.ReadCommodities, (event, args) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const api = new api_1.API(new Store());
    try {
        let commodities = yield api.getCommodities();
        win.webContents.send(AppEvents.ReadCommodities, commodities);
    }
    catch (e) {
        showErrorDialog(e);
    }
}));
electron_1.ipcMain.on(AppEvents.SaveCommodity, (event, args) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const api = new api_1.API(new Store());
    try {
        let newComm = yield api.saveCommodity(args);
        win.webContents.send(AppEvents.SaveCommodity, newComm);
    }
    catch (e) {
        showErrorDialog(e);
    }
}));
electron_1.ipcMain.on(AppEvents.CommodityById, (event, args) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const api = new api_1.API(new Store());
    try {
        api
            .CommodityById(args)
            .subscribe((x) => win.webContents.send(AppEvents.CommodityById, x));
    }
    catch (e) {
        showErrorDialog(e);
    }
}));
class Store {
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
        }
        catch (error) {
            showErrorDialog(error);
        }
        Store.instance = this;
        return this;
    }
}
exports.Store = Store;
function showErrorDialog(msg) {
    const title = 'Ocurrio un error';
    electron_1.dialog.showErrorBox(title, msg);
}
function userHome() {
    const linuxHome = 'HOME';
    const win32Home = 'USERPROFILE';
    return process.env[process.platform == 'win32' ? win32Home : linuxHome];
}
//# sourceMappingURL=main.js.map