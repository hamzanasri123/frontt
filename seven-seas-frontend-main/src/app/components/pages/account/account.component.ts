import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/users.interface';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

declare var initContent, initSidebar, initHexagons, initPopups: any;
declare var $: any;
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService,
    private route: ActivatedRoute,

  ) { }

  activeTab = -1;
  currentUser: User
  ngOnInit(): void {
    initSidebar();
    initContent();
    initHexagons();
    this.currentUser = this.authService.getCurrentUser();
    this.userService.getUser(this.currentUser._id).subscribe(
      res => {
        if (this.activeTab === -1) this.activeTab = 0
        this.currentUser = res.data;
      },
      error => {
        this.toastr.error("Error while loading your informations", error.error.message);
      }
    );
    this.route.params.subscribe(params => {
      let page = params.page;
      switch (page) {
        case 'social': this.activeTab = 1; break;
        case 'change-password': this.activeTab = 2; break;
        default: break;
      }
    });
  }

  setTab(i) {
    this.activeTab = i;
  }

  updateUser() {
    this.authService.updateUser(this.currentUser).subscribe(
      res => {
        this.toastr.success(res.message);
      },
      err => {
        this.toastr.error("Can't update user!", err.error.message);
      }
    )
  }

}
