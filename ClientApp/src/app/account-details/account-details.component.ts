import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { UserDetailsResponse } from '../dtos/user-details-response';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  userDetails: UserDetailsResponse | null = null;

  constructor(private userService: UserService) { }

  userUpdateForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  ngOnInit(): void {
    this.userService.getCurrentUserDetails().subscribe({
      next: (response) => {
        this.userDetails = response;

        this.userUpdateForm.patchValue(response)
      },
      error: (response) => alert(response.error.message)
    });
  }



  onSubmit = (): void => {
    if (this.userUpdateForm.invalid)
      return;

    // TODO: remove
    if (!this.userUpdateForm.value.email || !this.userUpdateForm.value.fullName)
      return;

    // this.authService.register(this.userUpdateForm.value.email, this.userUpdateForm.value.fullName, this.registerForm.value.password)
    //   .subscribe({
    //     next: () => {
    //       this.router.navigate(['login'])
    //     },
    //     error: (response) => alert(JSON.stringify(response.error))
    //   });
  }

}
