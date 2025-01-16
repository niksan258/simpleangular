import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { UserDetailsUpdateRequest } from '../dtos/user-details-update-request';
import { Store } from '@ngrx/store';
import {
  loadCurrentUser,
  updateCurrentUser,
} from '../state/users/user.actions';
import { selectCurrentUser } from '../state/users/user.selector';
import { AppState } from '../state/app.state';
import { CurrentUserDetailsResponse } from '../dtos/current-user-details-response';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css'],
})
export class AccountDetailsComponent implements OnInit {
  userDetails: CurrentUserDetailsResponse | null = null;
  currentUser$ = this.store.select(selectCurrentUser);

  constructor(private store: Store<AppState>) {}

  userUpdateForm = new FormGroup({
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    fullName: new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new UntypedFormControl('', [Validators.minLength(8)]),
  });

  ngOnInit(): void {
    this.currentUser$.subscribe((currentUser) => {
      if (currentUser) {
        this.userDetails = currentUser;
        this.userUpdateForm.patchValue(currentUser);
      }
    });
    this.store.dispatch(loadCurrentUser());
  }

  onSubmit = (): void => {
    if (this.userUpdateForm.invalid) return;

    const user: UserDetailsUpdateRequest = {
      email: this.userUpdateForm.controls.email.value,
      fullName: this.userUpdateForm.value.fullName,
      password:
        this.userUpdateForm.value.password?.length != 0
          ? this.userUpdateForm.value.password
          : null,
    };

    this.store.dispatch(updateCurrentUser({ currentUser: user }));
  };

}
