import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/users.interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
declare var initForm: any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService

  ) { }
  @Input()
  user: User
  passwordForm: FormGroup;

  ngOnInit(): void {
    initForm();
    this.passwordForm = this.fb.group({
      //Password pattern : 
      //Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
    }, { updateOn: 'blur' });
  }

  updatePassword() {
    for (const i in this.passwordForm.controls) {
      this.passwordForm.controls[i].markAsDirty();
      this.passwordForm.controls[i].updateValueAndValidity();
    }
    if (this.passwordForm.invalid) {
      this.toastr.warning("Please enter your new and old passwords");
      return;
    }
    this.authService
      .updatePassword(this.passwordForm.controls.oldPassword.value, this.passwordForm.controls.newPassword.value)
      .subscribe(
        res => {
          this.toastr.success(res.message);
        },
        err => {
          this.toastr.error("Couldn't update password", err.error.message);
        }
      )
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.passwordForm.controls.newPassword.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
}
