import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CustomValidators } from '../custom-validators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
 
  loginForm = this.fb.group({
    email: ['', [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"), Validators.email]],
    password: ['', Validators.compose([
      Validators.required,
      //Validators.pattern("^[a-z0-9]")
    ])]
  });

  //CustomValidators.patternValidator(/[ [!@#$%^&*()_+-=[]{};':"|,.<>/?]/](<mailto:!@#$%^&*()_+-=[]{};':"|,.<>/?]/>), { hasSpecialCharacters: true })

  signUpForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['',Validators.required],
    confirmPassword: ['', Validators.required],
    role: ['Customer']
  });

  isSignUp = false;
  hide = true;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }
  

  OnLogin(){
      this.isSignUp = false;
  }

  OnSignUp(){
    this.isSignUp = true;
  }

  OnLoginSubmit(){
    console.log("Login form------", this.loginForm);
    let data = this.loginForm.value;
    this.authService.login(data).subscribe(result=>{
      this.router.navigate(['/dashboard']);
    }, err=>{

    });
  }

  OnSignUpSubmit(){

  }

}
