import { Component, OnInit } from '@angular/core';
declare var initContent, initSidebar, initHexagons, $: any;

@Component({
  selector: 'app-windy',
  templateUrl: './windy.component.html',
  styleUrls: ['./windy.component.scss']
})
export class WindyComponent implements OnInit {

  constructor() { }

  height = 800;
  width = 1400;

  ngOnInit(): void {
    initContent();
    initSidebar();
    initHexagons();
    this.height = $("#windy-container").height();
    this.width = $("#windy-container").width();
    console.log(this.height , this.width)
  }

}
