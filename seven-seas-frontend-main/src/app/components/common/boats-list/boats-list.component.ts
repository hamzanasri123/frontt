import { Component, Input, OnInit } from '@angular/core';
import { Boat } from 'src/app/interfaces/equipments.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-boats-list',
  templateUrl: './boats-list.component.html',
  styleUrls: ['./boats-list.component.scss']
})
export class BoatsListComponent implements OnInit {

  constructor() { }
  readonly API: string = environment.apiUrl + '/';

  @Input()
  boats : Boat[]
  ngOnInit(): void {
  }

}
