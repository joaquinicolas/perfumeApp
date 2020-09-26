import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ExcelService} from '../excel.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Fragancia} from '../home/home.component';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export interface Commodity {
  id: number;
  Name: string;
  Cost: number;
  Quantity: number;
  JoinTableId: string;
  Description: string;
}

function search(text: string, commodities: Commodity[]): Commodity[] {
  if (text === '') {
    return commodities;
  }
  return commodities.filter(v => {
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
  $commodities: Observable<Commodity[]>;
  filter = new FormControl('');
  // trigger opens up modal
  @ViewChild('trigger') trigger: ElementRef;

  constructor(private excelService: ExcelService, private cdr: ChangeDetectorRef, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.excelService.readCommodities();
    this.excelService.gotCommodities.subscribe(values => {
      this.commodities = values;
      console.log(values);
      this.$commodities = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => search(text, this.commodities))
      );
      this.cdr.detectChanges();
    });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'});
  }

  close(content) {
    this.modalService.dismissAll('Save changes');
    this.excelService.saveCommodity(this.commodity);
  }

  viewCommodity(c: Commodity) {
    this.commodity = c;
    this.trigger.nativeElement.click();
  }
}
