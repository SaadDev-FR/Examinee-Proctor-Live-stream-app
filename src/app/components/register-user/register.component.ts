import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { ConfigService } from 'src/app/services/ConfigService';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: UntypedFormGroup;

  constructor(private accountSevice: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private config: ConfigService) { }

  ngOnInit(): void {
    this.userSignupForm()
  }

  userSignupForm() {
    this.registerForm = new UntypedFormGroup({
      userName: new UntypedFormControl('', [Validators.required]),
      displayName: new UntypedFormControl('', [Validators.required, Validators.maxLength(20)]),
      password: new UntypedFormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)])
    })
  }

  register() {
    if (!this.config.clockRegister) {//true = block
      this.accountSevice.register(this.registerForm.value).subscribe(res => {
        this.router.navigateByUrl('/login');
      })
    } else {
      this.toastr.warning('Login failed!')
    }
  }

}
