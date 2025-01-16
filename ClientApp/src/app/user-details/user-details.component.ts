import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserDetailsResponse } from '../dtos/user-details-response';
import { FormControl } from '@angular/forms';
import { UserService } from '../services/user.service';
import { distinctUntilChanged, Observable } from 'rxjs';
import { AppState } from '../state/app.state';
import { Store } from '@ngrx/store';
import { selectAllUsers } from '../state/users/user.selector';
import { loadUsers } from '../state/users/user.actions';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit{
  users$ = this.store.select(selectAllUsers);
  
  userControl = new FormControl<string | null>(null);
  selectedUserId : string | null = '';

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(loadUsers());

    this.userControl.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe((selectedUserId) => {
      this.selectedUserId = selectedUserId;
    });
  }
}