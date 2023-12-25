import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  user: User;
  
  constructor(public accountService: AccountService, 
    private router: Router, 
    private toastr: ToastrService,
    
    ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user=> this.user = user);
  }

  ngOnInit(): void {
   
    this.userLoginForm();    
  }

  userLoginForm() {
    this.loginForm = new UntypedFormGroup({
      userName: new UntypedFormControl('', [Validators.required]),
      password: new UntypedFormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)])
    })
  }

  login(){
    this.accountService.login(this.loginForm.value).subscribe(res=>{
      this.router.navigateByUrl('/room');
    }, error=>{
      console.log(error);
      this.toastr.error(error.error);
    })
  }
  
}
