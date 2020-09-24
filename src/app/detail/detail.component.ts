import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ExcelService} from '../excel.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

export interface Commodity {
  id: number;
  Name: string;
  Cost: number;
  Quantity: number;
  JoinTableId: string;
  Description: string;
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  commodities: Commodity[];
  commodity: Commodity;
  // trigger opens up modal
  @ViewChild('trigger') trigger: ElementRef;

  constructor(private excelService: ExcelService, private cdr: ChangeDetectorRef, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.excelService.readCommodities();
    this.excelService.gotCommodities.subscribe(values => {
      this.commodities = values;
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
