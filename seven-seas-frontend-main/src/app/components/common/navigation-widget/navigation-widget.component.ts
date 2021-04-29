import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/interfaces/users.interface';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
declare var initHexagons;
@Component({
  selector: 'app-navigation-widget',
  templateUrl: './navigation-widget.component.html',
  styleUrls: ['./navigation-widget.component.scss']
})
export class NavigationWidgetComponent implements OnInit {
  readonly API: string = environment.apiUrl;

  constructor(private route: ActivatedRoute,
    private authService: AuthService,
    private el: ElementRef,
  ) { }
  currentUser: User
  isAdmin = false;
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    let profilePicture1, profilePicture2, profilePicture3;
    profilePicture1 = this.el.nativeElement.querySelector(
      '#profilePicture1'
    );
    profilePicture2 = this.el.nativeElement.querySelector(
      '#profilePicture2'
    );
    profilePicture3 = this.el.nativeElement.querySelector(
      '#profilePicture3'
    );
    profilePicture1.setAttribute('data-src', this.API + '/' + this.currentUser.profilePicture);
    profilePicture2.setAttribute('data-src', this.API + '/' + this.currentUser.profilePicture);
    profilePicture3.setAttribute('data-src', this.API + '/' + this.currentUser.profilePicture);
    initHexagons();
    this.isAdmin = this.authService.isAdmin();
  }

}
