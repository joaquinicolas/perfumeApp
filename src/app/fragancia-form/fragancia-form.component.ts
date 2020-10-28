import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { ExcelService } from '../excel.service';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Commodity } from '../detail/detail.component';
import { Fragancia } from '../home/home.component';

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
  commodity: Commodity;
  totalQuantity: number;
  private selectedComoditySubject = new BehaviorSubject<Commodity>(null);
  selectedCommodity$ = this.selectedComoditySubject.asObservable();
  model: any;

  constructor(
    private excelService: ExcelService,
    private cdr: ChangeDetectorRef
  ) {}

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
    this.fragancia.Cost = this.fragancia.Components.reduce(
      (previousValue, currentValue): number =>
        currentValue.Cost * (currentValue.Quantity || 0) + previousValue,
      0
    );
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

  save() {
    this.excelService.saveChanges(this.fragancia);
  }

  updateTotalQuantity() {
    this.totalQuantity = 0;
    this.totalQuantity = this.fragancia.Components.reduce(
      (previousValue, currentValue) => previousValue + currentValue.Quantity,
      0
    );
    this.updateCost();
  }

  add() {
    this.selectedComoditySubject.next(
      this.commodities.filter((value) => {
        if (value.Description === this.model) {
          return value;
        }
      })[0]
    );
  }
}
