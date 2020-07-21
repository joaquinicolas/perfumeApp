import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ExcelService} from '../excel.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

export interface Fragancia {
  id: number;
  Description: string;
  Cost: number;
  Price: number;
  Components: Commodity[];
}

interface Commodity {
  id: number;
  Description: string;
  Cost: number;
  CostByUnit: number;
  Quantity: number;
  JoinTableId: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  perfumes: Fragancia[];
  fragancia: Fragancia;
  // trigger opens up modal
  @ViewChild('trigger') trigger: ElementRef;

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

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'});
  }

  close(content) {
    this.modalService.dismissAll('Save changes');
    this.excelService.saveChanges(this.fragancia);
  }

  viewFragancia(p: Fragancia) {
    this.fragancia = p;
    this.trigger.nativeElement.click();
  }
}
