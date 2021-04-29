import { Component, Input, OnInit } from '@angular/core';
import { Hebergement } from 'src/app/interfaces/equipments.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hebergement-list',
  templateUrl: './hebergement-list.component.html',
  styleUrls: ['./hebergement-list.component.scss']
})
export class HebergementListComponent implements OnInit {

  constructor() { }
  readonly API: string = environment.apiUrl + '/';

  @Input()
  hebergements: Hebergement[];
  ngOnInit(): void {
  }

}
