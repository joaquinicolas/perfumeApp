import { Fragancia } from './entity/Fragancia';
import { Commodity } from './entity/Commodity';
import * as Excel from 'exceljs';
import { CommoditiesFileName, FraganciasFileName } from './constant';
import * as path from 'path';
import { Workbook, Worksheet } from 'exceljs';

const CREATOR = 'Fragancias';

export interface Column {
  header: string;
  key: string;
}

export class Spreadsheet {
  public readCommoditiesFile(path: string): Promise<Commodity[]> {
    return new Promise((resolve, reject) => {
      const workbook = new Excel.Workbook();
      workbook.xlsx.readFile(path).then(() => {
        const result = [];
        const sheet = workbook.getWorksheet(1);
        sheet.eachRow((row, number) => {
          if (row.hasValues && number > 1) {
            const commodity = new Commodity();
            commodity._id = row.getCell('A').toString();
            commodity.Description = row.values[2];
            const cost = +row.getCell('C').result
              ? +row.getCell('C').result.toString()
              : +row.getCell('C').value;
            commodity.Cost = cost;
            commodity.SecondaryName = row
              .getCell('D')
              .toString()
              .toUpperCase()
              .trim();
            result.push(commodity);
          }
        });
        resolve(result);
      });
    });
  }

  public async newFraganciasWorkbook(dbPath: string, fragancias: Fragancia[]) {
    const sheetName = 'SHEET_1';
    const workbook = this.newWorkbook();
    this.addWorksheet([sheetName], [workbook]);
    const sheet = workbook.getWorksheet(sheetName);
    this.addColumns(
      [
        { header: 'ID', key: 'id' },
        { header: 'Nombre', key: 'description' },
        { header: 'Costo', key: 'cost' },
      ],
      [sheet]
    );

    for (let i = 0; i < fragancias.length; i++) {
      const element = fragancias[i];
      sheet.addRow(
        {
          id: element._id,
          description: element.Description,
          cost: element.Cost,
        },
        'i'
      );
    }

    await workbook.xlsx.writeFile(path.resolve(dbPath, FraganciasFileName));
  }
  public async newCommoditiesWorkbook(
    commodities: Commodity[],
    dbPath: string
  ) {
    const sheetName = 'SHEET_1';
    let workbook = this.newWorkbook();
    this.addWorksheet([sheetName], [workbook]);
    let sheet = workbook.getWorksheet(sheetName);
    this.addColumns(
      [
        { header: 'ID', key: 'id' },
        { header: 'Descripcion', key: 'description' },
        { header: 'Costo', key: 'cost' },
        { header: 'Nombre secundario', key: 'secondaryName' },
      ],
      [sheet]
    );

    for (let i = 0; i < commodities.length; i++) {
      const element = commodities[i];
      sheet.addRow(
        {
          id: element._id,
          description: element.Description,
          cost: element.Cost,
          secondaryName: element.SecondaryName,
        },
        'i'
      );
    }
    await workbook.xlsx.writeFile(path.resolve(dbPath, CommoditiesFileName));
  }

  private addWorksheet(sheets: string[], workBook: Workbook[]) {
    for (let i = 0; i < sheets.length; i++) {
      const element = sheets[i];
      const sheet = workBook[0].addWorksheet(element);
      sheet.state = 'visible';
    }
  }

  private addColumns(columns: Column[], worksheet: Worksheet[]) {
    worksheet[0].columns = columns;
    return worksheet;
  }

  // Return a workbook stream writer
  private newWorkbook(): Excel.Workbook {
    const workbook = new Excel.Workbook();

    return workbook;
  }
}
