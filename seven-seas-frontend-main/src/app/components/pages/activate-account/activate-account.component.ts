import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { TranslateService } from '@ngx-translate/core';

declare var initForm: any;
declare var initLoginTabs: any;
@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private translate: TranslateService,
  ) { }

  verifying = true;

  ngOnInit(): void {
    initLoginTabs();
    let token = this.route.snapshot.params.token;
    this.authService.verifyActivationToken(token).subscribe(
      res => {
        this.verifying = false;
        Swal.fire({
          title: this.translate.instant('account_activated'),
          icon: 'success'
        });
      },
      err => {
        this.verifying = false;
        console.log(err);
        Swal.fire({
          title: this.translate.instant('invalid_confirmation_link'),
          icon: 'error'
        });
      }
    )
  }

}
