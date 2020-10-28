import { Component, OnInit } from '@angular/core';
import { remote, ipcRenderer } from 'electron';
import { AppEvents, ExcelService, FileStatus } from '../excel.service';

@Component({
  selector: 'app-commodities-form',
  templateUrl: './commodities-form.component.html',
  styleUrls: ['./commodities-form.component.css'],
})
export class CommoditiesFormComponent implements OnInit {
  constructor(private excelService: ExcelService) {}

  ngOnInit(): void {}

  uploadFile() {
    this.excelService.uploadFile();
  }
}
