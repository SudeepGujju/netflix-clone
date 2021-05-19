import { Highlightable, ListKeyManagerOption } from '@angular/cdk/a11y';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-carousal-card',
  templateUrl: './carousal-card.component.html',
  styleUrls: ['./carousal-card.component.scss']
})
export class CarousalCardComponent implements OnInit, ListKeyManagerOption {

  @Input() public image: string = "";

  @Input() public disabled = false; // implements ListKeyManagerOption

  @ViewChild(TemplateRef, {static: true}) public cardTemplate: TemplateRef<any>;

  constructor() { }

  ngOnInit(): void {
  }

  getLabel() {
    return this.image;
  }

}
