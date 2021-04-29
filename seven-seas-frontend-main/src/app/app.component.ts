import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

declare var init: any;
declare var $: any;


@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(translate: TranslateService) {
    let language = localStorage.getItem("language");
    if (language) {
      translate.use(language);
    }
  }

  ngOnInit(): void {
  }
}
