import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ExcelService} from '../excel.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Fragancia} from "../home/home.component";
import {FormControl} from "@angular/forms";
import {map, startWith, switchMap, tap, timeout} from "rxjs/operators";
import {combineLatest, concat, interval, merge, Observable, of} from "rxjs";

export interface Commodity {
  SecondaryName: string;
  _id: any;
  Cost: number;
  Quantity: number;
  Description: string;
}

function search(text: string, commodities: Commodity[]): Commodity[] {
  if (text === '') {
    return commodities;
  }
  return commodities.filter((v) => {
    const term = text.toLowerCase();
    return v.Description.toLowerCase().includes(term);
  });
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  commodities: Commodity[];
  commodity: Commodity;
  commodities$: Observable<Commodity[]>
  filter = new FormControl('');
  // trigger opens up modal
  @ViewChild('trigger') trigger: ElementRef;

  constructor(private excelService: ExcelService, private cdr: ChangeDetectorRef, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.excelService.readCommodities();

    const filterByText = this.filter.valueChanges
      .pipe(
        startWith(''),
      );
    this.commodities$ = combineLatest(
      this.excelService.gotCommodities,
      filterByText,
      interval(1000)
    )
      .pipe(
        map(([commodities, text]) => search(text, commodities))
      );

    this.commodities$.subscribe((res) => {
      this.cdr.detectChanges();
    });

  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'});
  }

  close(content) {
    this.modalService.dismissAll('Save changes');
    this.excelService.updateCommodity(this.commodity);
  }

  viewCommodity(c: Commodity) {
    this.commodity = c;
    this.trigger.nativeElement.click();
  }

  downloadFile() {
    this.excelService.downloadCommodities();
  }
}
