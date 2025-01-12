import { Component } from '@angular/core';
import { FormGroup, UntypedFormControl, Validators } from '@angular/forms';
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
    email: new UntypedFormControl('',[Validators.required, Validators.email]),
    password: new UntypedFormControl('', [Validators.required, Validators.minLength(8)])
  });


  onSubmit = () : void => {
    if(this.loginForm.invalid)
      return;

    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
    .subscribe({
      next: () => {
        this.router.navigate(['fetch-data'])
      },
      error: (response) => alert(response.error.message)
    });
  }
}
