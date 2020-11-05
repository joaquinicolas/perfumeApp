import {Commodity} from './entity/Commodity';
import {Observable} from 'rxjs';
import * as Excel from 'exceljs';

export class Spreadsheet {
  public readCommoditiesFile(path: string): Observable<Commodity> {
    return new Observable((observer) => {
      const workbook = new Excel.Workbook();
      workbook.xlsx.readFile(path).then(() => {
        const sheet = workbook.getWorksheet(1);
        sheet.eachRow((row, number) => {
          if (row.hasValues && number > 1) {
            const commodity = new Commodity();
            commodity.Description = row.values[1];
            const cost = +row.getCell("B").result ? +row.getCell("B").result.toString() : +row.getCell('B').value;
            commodity.Cost = cost;
            commodity.SecondaryName = row.getCell("C").toString().toUpperCase().trim();
            observer.next(commodity);
          }
        });
        observer.complete();
      });
    });
  }
}
