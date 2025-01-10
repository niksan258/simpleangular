import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
    email: new FormControl('',[Validators.required, Validators.email]),
    fullName: new FormControl('',[Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });


  onSubmit = () : void => {
    if(this.registerForm.invalid)
      return;

    // TODO: remove
    if(!this.registerForm.value.email || !this.registerForm.value.fullName || !this.registerForm.value.password)
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
