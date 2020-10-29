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
const excel_1 = require("./excel");
var AppEvents;
(function (AppEvents) {
    AppEvents["ReadCommodities"] = "getCommodities";
    AppEvents["SaveCommodity"] = "saveCommodity";
    AppEvents["ReadFragancias"] = "getFragancias";
    AppEvents["SaveFragancias"] = "saveChanges";
    AppEvents["CommodityById"] = "commodityById";
    AppEvents["UploadFile"] = "uploadFile";
})(AppEvents = exports.AppEvents || (exports.AppEvents = {}));
var FileStatus;
(function (FileStatus) {
    FileStatus[FileStatus["Ok"] = 0] = "Ok";
    FileStatus[FileStatus["Error"] = 1] = "Error";
})(FileStatus = exports.FileStatus || (exports.FileStatus = {}));
var FileStatusMessages;
(function (FileStatusMessages) {
    FileStatusMessages["Ok"] = "Materias primas almacenadas exitosamente";
    FileStatusMessages["Error"] = "Material primas no pudieron ser almacenadas";
})(FileStatusMessages || (FileStatusMessages = {}));
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
electron_1.ipcMain.on(AppEvents.UploadFile, (event) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const res = yield electron_1.dialog.showOpenDialog(win, {
        properties: ['openFile'],
        filters: [{ name: 'Custom File Type', extensions: ['xlsx', 'xls'] }],
    });
    if (res.canceled) {
        win.webContents.send(AppEvents.UploadFile, '');
    }
    else {
        try {
            const store = new Store();
            const api = new api_1.API(store);
            const spreadsheetAPI = new excel_1.Spreadsheet();
            spreadsheetAPI.readCommoditiesFile(res.filePaths[0]).subscribe((val) => api.saveCommodity(val), (err) => {
                showErrorDialog(err);
                win.webContents.send(AppEvents.UploadFile, FileStatus.Error);
            }, () => {
                showMessageBox(FileStatusMessages.Ok);
                win.webContents.send(AppEvents.UploadFile, FileStatus.Ok);
            });
        }
        catch (err) {
            showErrorDialog(err);
            win.webContents.send(AppEvents.UploadFile, FileStatus.Error);
        }
    }
}));
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
        showMessageBox('Fragancia almacenada exitosamente');
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
        if (args._id) {
            yield api.updateFraganciaByCommodity(newComm);
        }
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
            throw error;
        }
        Store.instance = this;
        return this;
    }
}
exports.Store = Store;
function showErrorDialog(msg) {
    const title = 'Ocurrio un error';
    return electron_1.dialog.showErrorBox(title, msg.toString());
}
function showMessageBox(message) {
    const title = 'Accion exitosa';
    const type = 'info';
    const buttons = ['Entiendo'];
    return electron_1.dialog.showMessageBox(win, {
        title,
        message,
        type,
        buttons,
    });
}
function userHome() {
    const linuxHome = 'HOME';
    const win32Home = 'USERPROFILE';
    return process.env[process.platform == 'win32' ? win32Home : linuxHome];
}
//# sourceMappingURL=main.js.map