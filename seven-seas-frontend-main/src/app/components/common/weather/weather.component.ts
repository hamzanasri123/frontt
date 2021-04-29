import { Component, OnInit } from '@angular/core';
declare var $;
@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  width = 280;
  constructor() { }
  ngOnInit(): void {
    this.width = $("#weather-container").width();
  }

}
