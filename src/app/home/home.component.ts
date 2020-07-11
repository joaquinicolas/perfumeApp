import {Component, OnInit} from '@angular/core';

enum Type {
  Perfume = 'Perfume',
  EdP = 'Eau de Perfume',
  EdT = 'Eau de Toillete',
  EdC = 'Eau de cologne',
  EdS = 'Splash perfumes'
}

function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = (Object.values(anEnum) as unknown) as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  perfumes: any[];
  isCollapsed = false;

  constructor() {
    const p = [];
    for (let i = 0; i < 50; i++) {
      p[i] = {
        Name: `Perfume-${i}`,
        Price: `${Math.random() * (15000 - 500) + 500}`,
        Type: randomEnum(Type),
        Show: false,
      };
    }
    this.perfumes = p;
  }

  ngOnInit(): void {
  }

}
