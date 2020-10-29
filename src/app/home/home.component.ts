import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {ExcelService} from '../excel.service';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {merge, Observable, Subject} from 'rxjs';
import {FormControl} from '@angular/forms';
import {map, mapTo, startWith, tap} from 'rxjs/operators';
import {ExportService} from '../export.service';
import {Commodity} from '../detail/detail.component';

export interface Fragancia {
  _id: any;
  Description: string;
  Cost: number;
  Price: number;
  Components: Commodity[];
  totalQuantity: number;
}

enum Actions {
  DisplayFragancia = 0,
  PrintFragancia = 1,
  ExportFragancia = 2,
}

function search(text: string, f: Fragancia[]): Fragancia[] {
  if (text === '') {
    return f;
  }
  return f.filter((v) => {
    const term = text.toLowerCase();
    return v.Description.toLowerCase().includes(term);
  });
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
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
    private exportService: ExportService,
    config: NgbModalConfig,
  ) {

    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.excelService.readData();
    this.excelService.gotFragancias.subscribe((values) => {
      const fragancias = values.map(v => ({
        _id: v._id,
        Description: v.Description,
        Cost: v.Cost,
        Price: v.Price,
        Components: v.Components.map(c => ({
          _id: c._id,
          Cost: c.Cost,
          Quantity: c.Quantity,
          Description: c.Description
        })),
        totalQuantity: v.totalQuantity,
      }));

      // Save ids for avoiding repeat requests.
      const keys = {};
      for (let i = 0; i < fragancias.length; i++) {
        let element = fragancias[i];
        element.Components.forEach((val) => {
          if (!keys[val._id]) {
            this.excelService.ComponentById(val._id);
          }
        });
      }

      const filterByText$ = this.filter.valueChanges.pipe(
        startWith(''),
        map((text) => search(text, values)),
      );

      const updateFragancias = (commodity) => {
        return values.map((v) => {
          for (let i = 0; i < v.Components.length; i++) {
            let element = v.Components[i];
            if (element._id == commodity._id) {
              v.Components[i] = Object.assign({}, element, commodity);
            }
          }
          return v;
        })
      }

      const updateFragancias$ = this.excelService.Commodity$.pipe(
        map((c) => updateFragancias(c))
      );

      this.perfumes$ = merge(
        updateFragancias$,
        filterByText$
      );

      this.perfumes$.subscribe(() => {
        this.cdr.detectChanges();
      });


    });
  }

  open(content, size: string = 'xl') {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size,
    });
  }

  close(content) {
    this.modalService.dismissAll('Save changes');
    switch (this.action) {
      case Actions.DisplayFragancia:
        // Update fragancia.Cost before updating.
        this.fragancia.Cost = this.fragancia.Components.reduce(
          (previousValue, currentValue) =>
            previousValue + (currentValue.Quantity * currentValue.Cost), 0
        );
        this.fragancia.Price = this.fragancia.Cost * 2;
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
        p.Components.forEach((value) => {
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
    this.fragancia.Components.forEach((value) => {
      this.totalQuantity += value.Quantity;
    });
  }

  exportTOExcel() {
    this.action = Actions.ExportFragancia;
    this.exportService.exportExcel(
      this.fragancia.Components,
      this.fragancia.Description
    );
    this.action = -1;
  }
}
