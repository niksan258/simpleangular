import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  private authService : AuthService;
  isSubmitted = false;

  constructor(authService : AuthService) {
    this.authService = authService;
  }

  loginForm = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });


  onSubmit = () : void => {
    this.isSubmitted = true;

    if(this.loginForm.invalid)
      return;

    // TODO: remove
    if(!this.loginForm.value.email || !this.loginForm.value.password)
      return;

    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
    .subscribe({
      next: (response) => alert(JSON.stringify(response)),
      error: (error) => alert(JSON.stringify(error.message))
    });
  }
}
