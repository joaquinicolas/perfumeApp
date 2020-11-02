import {Component, OnInit} from '@angular/core';
import {remote, ipcRenderer} from 'electron';
import {AppEvents, ExcelService, FileStatus} from '../excel.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-commodities-form',
  templateUrl: './commodities-form.component.html',
  styleUrls: ['./commodities-form.component.css'],
})
export class CommoditiesFormComponent implements OnInit {
  constructor(private excelService: ExcelService, private router: Router) {
  }

  ngOnInit(): void {
  }

  uploadFile() {
    this.excelService.uploadFile(() => {
      this.router.navigate(['/']);
    });
  }
}
