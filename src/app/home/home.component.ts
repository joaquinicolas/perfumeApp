import {AfterContentChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ExcelService} from '../excel.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

export interface Fragancia {
  id: number;
  Description: string;
  Cost: number;
  Price: number;
  Components: Commodity[];
  totalQuantity: number;
}

interface Commodity {
  id: number;
  Description: string;
  Cost: number;
  CostByUnit: number;
  Quantity: number;
  JoinTableId: number;
}

enum Actions {
  DisplayFragancia = 0,
  PrintFragancia = 1,
  ExportFragancia = 2
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  perfumes: Fragancia[];
  fragancia: Fragancia;
  action: Actions;
  // trigger opens up modal
  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('print_btn') printBtn: ElementRef;
  @ViewChild('export_btn') exportBtn: ElementRef;

  constructor(private excelService: ExcelService, private cdr: ChangeDetectorRef, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.excelService.readData();
    this.excelService.gotFragancias.subscribe(values => {
      this.perfumes = values;
      console.log(values);
      this.cdr.detectChanges();
    });
  }

  open(content, size: string = 'xl') {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: size});
  }

  close(content) {
    this.modalService.dismissAll('Save changes');
    switch (this.action) {
      case Actions.DisplayFragancia:
        this.excelService.saveChanges(this.fragancia);
        break;
      case Actions.PrintFragancia:
        console.log('Printing...');
        break;
      case Actions.ExportFragancia:
        console.log('Exporting...');
        break;
    }
  }

  toggleFraganciaPopup(event: any, p: Fragancia, action: Actions) {
    event.stopPropagation();
    this.fragancia = p;
    this.action = action;
    switch (action) {
      case Actions.DisplayFragancia:
        this.trigger.nativeElement.click();
        break;
      case Actions.PrintFragancia:
        this.printBtn.nativeElement.click();
        break;
      case Actions.ExportFragancia:
        this.exportBtn.nativeElement.click();
        break;
    }
  }
}
