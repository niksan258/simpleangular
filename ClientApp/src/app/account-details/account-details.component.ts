import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { UserDetailsResponse } from '../dtos/user-details-response';
import { FormControl, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { UserDetailsUpdateRequest } from '../dtos/user-details-update-request';


@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  userDetails: UserDetailsResponse | null = null;

  constructor(private userService: UserService) { }

  userUpdateForm = new FormGroup({
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    fullName: new UntypedFormControl('', [Validators.required, Validators.minLength(3)]),
    password: new UntypedFormControl('', [Validators.minLength(8)]),

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

    const user : UserDetailsUpdateRequest = {
      email: this.userUpdateForm.controls.email.value,
      fullName: this.userUpdateForm.value.fullName,
      password: this.userUpdateForm.value.password?.length != 0 ? this.userUpdateForm.value.password : null
    }

    this.userService.updateCurrentUserDetails(user)
      .subscribe({
        next: () => {
          alert("updated");
        },
        error: (response) => alert(JSON.stringify(response.error))
      });
  }

  ngOnDestroy()
  {
    
  }

}
