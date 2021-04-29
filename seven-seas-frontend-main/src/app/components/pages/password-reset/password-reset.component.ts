import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

declare var initForm: any;

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  resetForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
  ) { }

  verifiedToken = false;
  token: string;
  ngOnInit(): void {
    initForm();
    this.token = this.route.snapshot.params.token;
    Swal.fire({
      title: 'Verifying token!',
      timer: 1000,
      timerProgressBar: true,
      showConfirmationButton: false,
      showCancelButton: false,
      showLoaderOnConfirm: true,
    })
    this.authService.verifyRestPasswordToken(this.token).subscribe(
      res => {
        Swal.fire({
          position: 'top',
          icon: 'info',
          title: 'Valid token!',
          showConfirmButton: false,
          timer: 500
        })
        this.verifiedToken = true;
      },
      err => {
        Swal.fire({
          icon: 'error',
          title: "Can't reset password!",
          text: err.error.message,
          footer: '<a href="/password-reset-request">Resuest new token</a>'
        }).then((result) => {
          this.router.navigateByUrl("/password-reset-request");
        });

      }
    )
    this.resetForm = this.fb.group({
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
    }, { updateOn: 'blur' });
  }

  resetPassword() {
    if (this.resetForm.invalid) {
      this.toastr.error("Passwords should match");
      return;
    }
    console.log(this.resetForm.controls);
    this.authService.resetPassword(this.resetForm.controls.password.value, this.token)
      .subscribe(
        res => {
          Swal.fire({
            icon: 'success',
            title: "Password reset!",
          }).then((result) => {
            this.router.navigate(['/login'])
              .then(() => {
                window.location.reload();
              });
          });
        },
        err => {
          this.toastr.error(err.error.message);
        }
      )
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.resetForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
}
