import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/users.interface';
import { TranslateService } from '@ngx-translate/core';
declare var initHeader: any;
declare var loadSvg: any;
declare var initHexagons: any;
declare var initContent: any;
declare var liquidify: any;
declare var initTooltips: any;
declare var initSidebar: any;
declare var initPopups: any;
declare var initLoader: any;
@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  constructor(
    private translate: TranslateService,
  ) { }
  currentLanguage: string;
  ngOnInit(): void {
    initHeader();
    loadSvg();
    initHexagons();
    initContent();
    liquidify();
    initTooltips();
    initPopups();
    initLoader();
    initSidebar();
    this.currentLanguage = localStorage.getItem("language") || "fr";
  }
  setLanguage(language: string) {
    this.currentLanguage = language;
    localStorage.setItem("language", language);
    this.translate.use(language);
  }
}
