import { Component, OnInit } from '@angular/core';
import { UserDetailsResponse } from '../dtos/user-details-response';
import { FormControl } from '@angular/forms';
import { UserService } from '../services/user.service';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  users: UserDetailsResponse[] = [];
  
  userControl = new FormControl<string | null>(null);
  selectedUserId : string | null = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response;
      },
      error: (error) => {
        alert('Failed to load users.');
      }
    });

    this.userControl.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe((selectedUserId) => {
      this.selectedUserId = selectedUserId;
    });
  }
}