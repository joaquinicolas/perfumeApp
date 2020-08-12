import {Injectable} from '@angular/core';
import {Commodity} from './detail/detail.component';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() {
  }

  fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';

  public exportExcel(jsonData: Commodity[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const wb: XLSX.WorkBook = {Sheets: {'Sheet-1': ws}, SheetNames: ['Sheet-1']};
    XLSX.writeFile(wb, `${fileName}.xlsx`);
    // const excelBuffer: any = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
    // this.saveFile(excelBuffer, fileName);
  }

  private saveFile(excelBuffer: any, fileName: string) {
    const blob: Blob = new Blob([excelBuffer], {type: this.fileType});
    // FileSaver.saveAs(data, fileName + this.fileExtension);
  }
}
