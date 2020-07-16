import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ExcelService } from "../excel.service";

export interface Fragancia {
  id: number;
  Description: string;
  Cost: number;
  Price: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  perfumes: Fragancia[];

  constructor(private excelService: ExcelService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.excelService.readData();
    this.excelService.gotFragancias.subscribe(values => {
      this.perfumes = values;
      this.cdr.detectChanges();
    });
  }

}
