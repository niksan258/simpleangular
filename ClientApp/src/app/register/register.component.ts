import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
constructor(private authService : AuthService, private router: Router) {
    this.authService = authService;
  }

  registerForm = new FormGroup({
    email: new UntypedFormControl('',[Validators.required, Validators.email]),
    fullName: new UntypedFormControl('',[Validators.required, Validators.minLength(3)]),
    password: new UntypedFormControl('', [Validators.required, Validators.minLength(8)])
  });


  onSubmit = () : void => {
    if(this.registerForm.invalid)
      return;

    this.authService.register(this.registerForm.value.email,this.registerForm.value.fullName, this.registerForm.value.password)
    .subscribe({
      next: () => {
        this.router.navigate(['login'])
      },
      error: (response) => alert(JSON.stringify(response.error))
    });
  }
}
