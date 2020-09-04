import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ExcelService} from '../excel.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {ExportService} from '../export.service';
import {Commodity} from '../detail/detail.component';

export interface Fragancia {
  id: number;
  Description: string;
  Cost: number;
  Price: number;
  Components: Commodity[];
  totalQuantity: number;
}

enum Actions {
  DisplayFragancia = 0,
  PrintFragancia = 1,
  ExportFragancia = 2
}

function search(text: string, f: Fragancia[]): Fragancia[] {
  if (text === '') {
    return f;
  }
  return f.filter(v => {
    const term = text.toLowerCase();
    return v.Description.toLowerCase().includes(term);
  });
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
  perfumes$: Observable<Fragancia[]>;
  filter = new FormControl('');
  totalQuantity: number;
  // trigger opens up modal
  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('print_btn') printBtn: ElementRef;
  @ViewChild('TABLE', {static: false}) tableToExport: ElementRef;

  constructor(
    private excelService: ExcelService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private exportService: ExportService) {
  }

  ngOnInit(): void {
    this.excelService.readData();
    this.excelService.gotFragancias.subscribe(values => {
      this.perfumes = values;
      console.log(values);
      this.perfumes$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => search(text, this.perfumes))
      );
      this.cdr.detectChanges();
    });
  }

  open(content, size: string = 'xl') {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size});
  }

  close(content) {
    this.modalService.dismissAll('Save changes');
    switch (this.action) {
      case Actions.DisplayFragancia:
        this.excelService.saveChanges(this.fragancia);
        break;
      case Actions.PrintFragancia:
        window.print();
        break;
    }
  }

  toggleFraganciaPopup(event: any, p: Fragancia, action: Actions) {
    event.stopPropagation();
    this.fragancia = p;
    this.action = action;
    switch (action) {
      case Actions.DisplayFragancia:
        this.totalQuantity = 0;
        p.Components.forEach(value => {
          this.totalQuantity += value.Quantity;
        });
        this.trigger.nativeElement.click();
        break;
      case Actions.PrintFragancia:
        this.printBtn.nativeElement.click();
        break;
    }
  }

  updateTotalQuantity() {
    this.totalQuantity = 0;
    this.fragancia.Components.forEach(value => {
      this.totalQuantity += value.Quantity;
    });
  }

  exportTOExcel() {
    this.action = Actions.ExportFragancia;
    this.exportService.exportExcel(this.fragancia.Components, this.fragancia.Description);
    this.action = -1;
  }
}
