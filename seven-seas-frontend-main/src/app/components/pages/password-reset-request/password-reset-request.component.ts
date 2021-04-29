import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

declare var initForm: any;

@Component({
  selector: 'app-password-reset-request',
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.scss']
})
export class PasswordResetRequestComponent implements OnInit {

  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
  ) { }

  verifying = false;

  ngOnInit(): void {
    initForm();
    this.resetForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
    }, { updateOn: 'blur' });
  }

  sendResetRequest() {
    if (this.resetForm.invalid) {
      this.toastr.error("Invalid email!");
      return;
    }
    this.authService.resetPasswordRequest(this.resetForm.controls.email.value)
      .subscribe(
        res => {
          this.toastr.success("Reset password request sent successfuly!");
        },
        err => {
          this.toastr.error(err.error.message);
        }
      )
  }

}
