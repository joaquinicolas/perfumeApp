import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {ExcelService} from '../excel.service';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import {Commodity} from '../detail/detail.component';
import {Fragancia} from '../home/home.component';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";

function search(text: string, values: Commodity[]) {
  if (text === '') {
    return of(values);
  }

  return of(
    values.filter((v) => {
      const term = text.toLowerCase().trim();
      return v.Description.toLowerCase().trim().includes(term);
    })
  );
}

@Component({
  selector: 'app-fragancia-form',
  templateUrl: './fragancia-form.component.html',
  styleUrls: ['./fragancia-form.component.css'],
})
export class FraganciaFormComponent implements OnInit {
  commodities: Commodity[];
  searchFailed = false;
  searching = false;
  fragancia: Fragancia;
  totalQuantity: number;
  private selectedComoditySubject = new BehaviorSubject<Commodity>(null);
  selectedCommodity$ = this.selectedComoditySubject.asObservable();
  model: any;
  @ViewChild("searchbox") searchField: ElementRef;
  @ViewChild('quantityField') quantityField: ElementRef;

  constructor(
    private excelService: ExcelService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.excelService.readCommodities();
    this.excelService.gotCommodities.subscribe((values) => {
      console.log(values);
      this.commodities = values;
    });
    this.fragancia = {
      Cost: 0.0,
      Price: 0.0,
      Description: '',
      Components: [],
      totalQuantity: 0,
      _id: null,
    };
    this.selectedCommodity$.subscribe({
      next: (value) => {
        if (!value) {
          return;
        }
        this.fragancia.Components.push(value);
        this.updateCost();
      },
    });
    this.cdr.detectChanges();
  }

  updateCost() {
    const cost = this.fragancia.Components.reduce(
      (previousValue, currentValue): number =>
        currentValue.Cost * (currentValue.Quantity || 0) + previousValue,
      0
    );

    this.fragancia.Cost = toFixedNumber(cost, 2, 10);
  }

  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        search(term, this.commodities).pipe(
          map((response) => response.map((value) => value.Description)),
          tap(() => (this.searchFailed = false)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    );
  };

  save(modal) {
    this.modalService.open(
      modal,
      {
        ariaLabelledBy: 'modal-basic-title',
        size: 'sm',
      }
    ).result
      .then(res => this.excelService.saveChanges(
        this.fragancia,
        () => {this.router.navigate(['/'])})
      );
  }

  updateTotalQuantity() {
    this.totalQuantity = 0;
    this.totalQuantity = this.fragancia.Components.reduce(
      (previousValue, currentValue) => previousValue + currentValue.Quantity,
      0
    );
    this.updateCost();

    // After saving, close the modal.
    this.modalService.dismissAll('');
    this.searchField.nativeElement.focus();
  }

  add(modal: any) {
    this.selectedComoditySubject.next(
      this.commodities.filter((value) => {
        if (value.Description === this.model) {
          return value;
        }
      })[0]
    );
    this.model = "";
    this.modalService.open(modal, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'sm',
    });
    document.getElementById('quantityField')
      .focus();
  }
}

function toFixedNumber(num, digits, base) {
  var pow = Math.pow(base || 10, digits);
  return Math.round(num * pow) / pow;
}
