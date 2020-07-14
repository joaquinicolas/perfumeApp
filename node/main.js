//import { Workbook } from 'exceljs'
const ExcelJS = require('exceljs');
const path = require('path');
const { Fragancia, Commodity } = require('./models/sequelize');

const fraganciasFile = '/fragancias.xlsx',
    commoditiesFile = '/primas.xlsx';
/**
 * @typedef {Object} Fragancia
 * @property {number} id identifies a fragancia
 * @property {string} Description how a fragancia is called
 * @property {number} Cost how much the fragancia cost
 * @property {number} Price how much the fragancia is
 * @property {Component[]} Components how the fragancia is composed
 * 
 * @typedef {Object} Component
 * @property {Commodity} Component
 * @property {number} Quantity
 * 
 * @typedef {Object} Commodity
 * @property {number} id identifies a component
 * @property {string} Description how a component is called
 * @property {number} Cost how much the component cost
 */

module.exports.Excel = {
    /**
     * Read excel and returns an array of Fragancia.
     * @return {Promise<[]Fragancia>}
     */
    readData: () => {

        const fragancias = [];
        let workbook = new ExcelJS.Workbook();
        return workbook.xlsx.readFile(path.join(__dirname, fraganciasFile))
            .then((wb) => {
                wb.eachSheet((sheet, id) => {
                    const name = sheet.getCell("F2").value.toString();
                    const price = +sheet.getCell("G2").result.toString();
                    const cost = +sheet.getCell("H2").result.toString();
                    const ID = +sheet.getCell("I2").value.toString();
                    let components = [];
                    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                        if (rowNumber == 1) {
                            return
                        }
                        components.push({
                            Quantity: +row.getCell("C").value.toString(),
                            Component: {
                                id: +row.getCell("A").value.toString(),
                                Description: row.getCell("B").value.toString(),
                                Cost: +row.getCell("E").result.toString(),
                            },
                        });
                    });

                    fragancias.push({
                        Components: components,
                        Description: name,
                        Price: price,
                        Cost: cost,
                        id: ID
                    });
                });
                return fragancias;
            })
    },
    /** 
     * Read commodities excel
     * @return {Promise<Commodity>[]}
    */
    readCommodities: () => {
        const commodities = [];
        let workbook = new ExcelJS.Workbook();
        return workbook.xlsx.readFile(path.join(__dirname, commoditiesFile))
            .then(wb => {
                wb.eachSheet((sheet, id) => {
                    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                        if (rowNumber == 1) {
                            return
                        }
                        commodities.push({
                            id: +row.getCell('A').result.toString(),
                            Description: row.getCell('B').value.toString(),
                            Cost: +row.getCell("C").value.toString()
                        });
                    });
                });
            });
    },
};

module.exports.DB = {
    /**
     * save/update a fragancia
     * @param {Fragancia} fragancia
     * @return {Promise<Boolean>}
    */
    save: (fragancia) => {
        return Fragancia
            .findByPk(fragancia.ID)
            .then(f => {
                if (!f) {
                    return Fragancia
                        .create(fragancia)
                        .then(f => {
                            fragancia.Components.forEach((value) => {
                                f.addCommodity([value.Component]);
                            })
                            console.log('Fragancia saved successfully: ', f.toJSON());
                            return true
                        });
                }
            })
    },
    /**
     * create a commodity
     * @param {Commodity} commodity
     * @return {Promise<Commodity>}
     */
    createCommodity: commodity => {
        Commodity
            .create(commodity);
    }
}
