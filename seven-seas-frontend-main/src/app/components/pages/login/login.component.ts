import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

declare var initForm: any;
declare var initLoginTabs: any;
declare var loadSvg: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  signUpForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    initForm();
    initLoginTabs();
    loadSvg();
    this.loginForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      remember: new FormControl(true)
    }, { updateOn: 'blur' });

    this.signUpForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      //Password pattern : 
      //Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      nom: [null, [Validators.required]],
      prenom: [null, [Validators.required]],
      birthDate: [null, [Validators.required]],
      pays: [null, [Validators.required]],
    }, { updateOn: 'blur' });
    console.log(this.signUpForm);
  }


  login() {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }

    if (this.loginForm.invalid) {
      this.toastr.error("Verify your inputs!");
      return;
    }
    this.authService.authenticate(this.loginForm.controls.email.value,
      this.loginForm.controls.password.value)
      .subscribe(res => {
        this.toastr.success('Login Successful!', res.message);
        this.router.navigate(['/']);
      }, (err: any) => {
        if (err.error.message == 'Email not verified') {
          this.toastr.warning('Verify your email adress!');
          return;
        }
        this.toastr.error("Can't login!", err.error.message);
      });
  }

  signUp() {
    for (const i in this.signUpForm.controls) {
      this.signUpForm.controls[i].markAsDirty();
      this.signUpForm.controls[i].updateValueAndValidity();
    }

    if (this.signUpForm.invalid) {
      if(this.signUpForm.controls?.checkPassword?.errors?.confirm) {
        this.toastr.error("Passwords does not match!");
        return;
      }
      this.toastr.error("Verify your inputs!");
      return;
    }
    this.authService.signUp({
      'email': this.signUpForm.controls.email.value,
      'password': this.signUpForm.controls.password.value,
      'nom': this.signUpForm.controls.nom.value,
      'prenom': this.signUpForm.controls.prenom.value,
      'birthDate':this.dateFromat(this.signUpForm.controls.birthDate.value),
      'pays':this.signUpForm.controls.pays.value
    })
      .subscribe(
        response => {
          Swal.fire({
            title: this.translate.instant('verification_email_sent'),
            icon: 'info'
          });
          this.signUpForm.reset();
         
        },
        err => {
          this.toastr.error(err.error.message);
        }
      )
  }

  dateFromat(date) {
    return this.datepipe.transform(date, 'yyyy-MM-dd');
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.signUpForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

}
