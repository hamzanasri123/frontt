import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Notification } from 'src/app/interfaces/posts.interface';
import { User } from 'src/app/interfaces/users.interface';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

declare var initHeader: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
  ) { }
  readonly API: string = environment.apiUrl + '/';

  currentUser: User
  firstname: string;

  notifications: Notification[];

  language: string;

  searchKeyword: string;

  searchedUsers: User[] = [];

  ngOnInit(): void {
    initHeader();
    this.language = this.translate.currentLang;
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.language = event.lang;
    });
    this.currentUser = this.authService.getCurrentUser();
    this.firstname = this.currentUser.nom.split(' ')[0];
    this.userService.getNotifications().subscribe(
      res => {
        this.notifications = res.data;
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  setLanguage(language: string) {
    this.currentUser.language = language;
    this.authService.updateUser(this.currentUser).subscribe(
      res => {
        console.log(res);
        localStorage.setItem("language", language);
        this.translate.use(language);
      }
    )
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  goToNotification(i) {
    let url = "";
    switch (this.notifications[i].type) {
      case "reservation_request":
        url = ""
        break;
      case "followed_you":
        url = "/profile/" + this.notifications[i].sender.slug;
        break;
      default:
        url = "/post/" + this.notifications[i].targetId;
        break;
    };
    this.router.navigateByUrl(url);
  }

  search() {
    if (!this.searchKeyword) return;
    this.userService.search(this.searchKeyword).subscribe(
      res => {
        console.log(res);

        this.searchedUsers = res.data;
      }
    )
  }


}
