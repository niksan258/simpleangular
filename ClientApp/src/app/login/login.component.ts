import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  constructor(private authService : AuthService, private router: Router) {
    this.authService = authService;
  }

  loginForm = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });


  onSubmit = () : void => {
    if(this.loginForm.invalid)
      return;

    // TODO: remove
    if(!this.loginForm.value.email || !this.loginForm.value.password)
      return;


    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
    .subscribe({
      next: (response) => {
        this.router.navigate(['fetch-data'])
      },
      error: (response) => alert(response.error.message)
    });
  }
}
