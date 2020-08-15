//import { Workbook } from 'exceljs'
const ExcelJS = require('exceljs');
const path = require('path');
const {Fragancia, Commodity, FraganciaCommodity} = require('./models/sequelize');

const fraganciasFile = '/fragancias.xlsx',
  commoditiesFile = '/primas.xlsx',
  unicodeNormForm = 'NFD';
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
          const name = sheet.getCell("E2").result ? sheet.getCell("E2").result.toString() : sheet.getCell("E2").value.toString();
          const price = +sheet.getCell("F2").result ? sheet.getCell("F2").result.toString() : sheet.getCell("F2").value.toString();
          const cost = +sheet.getCell("G2").result ? sheet.getCell("G2").result.toString() : sheet.getCell('G2').value.toString();
          let components = [];
          sheet.eachRow({includeEmpty: false}, (row, rowNumber) => {
            if (rowNumber == 1) {
              return
            }
            components.push({
              Quantity: +row.getCell("B").result ? +row.getCell('B').result.toString() : +row.getCell('B').value.toString(),
              Component: {
                Description: row.getCell("A").value.toString().trim().normalize(unicodeNormForm),
                Cost: +row.getCell("D").result ? +row.getCell("D").result.toString() : +row.getCell('D').value,
              },
            });
          });

          fragancias.push({
            Components: components,
            Description: name.trim().normalize(unicodeNormForm),
            Price: price,
            Cost: cost,
          });
        });
        return fragancias;
      })
  },
  /**
   * Read commodities excel
   * @return {Promise<Commodity[]>}
   */
  readCommodities: () => {
    let commodities = [];
    let workbook = new ExcelJS.Workbook();
    return workbook.xlsx.readFile(path.join(__dirname, commoditiesFile))
      .then(wb => {
        wb.eachSheet((sheet, id) => {
          sheet.eachRow({includeEmpty: false}, (row, rowNumber) => {
            if (rowNumber == 1) {
              return
            }
            commodities.push({
              Description: row.getCell('A').value.toString().trim().normalize(unicodeNormForm),
              Cost: +row.getCell("B").result ? +row.getCell("B").result : +row.getCell("B").value
            });
          });
        });
        return Promise.resolve(commodities);
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
      .create(fragancia)
      .then(f => {
        return fragancia.Components.map((value) => {
            FraganciaCommodity.create({
              Quantity: value.Quantity,
              fraganciaDescription: f.get('Description'),
              commodityDescription: value.Component.Description
            });
          }
        );
      })
      .then(() => {
        console.log('Fragancia saved successfully.');
        return Promise.resolve();
      });
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
