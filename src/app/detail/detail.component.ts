import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  components: any[];
  constructor() {
    const c = [];
    for (let i = 0; i < 50; i++) {
      c[i] = {
        Name: `Component-${i}`,
        Price: `${Math.random() * (15000 - 500) + 500}`,
        Quantity: `${Math.random() * (100 - 10) + 10}`
      };
    }
    this.components = c;
  }

  ngOnInit(): void { }
}
