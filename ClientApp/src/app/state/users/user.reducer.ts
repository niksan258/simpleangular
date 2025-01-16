import { createReducer, on } from '@ngrx/store';
import { UserDetailsResponse } from 'src/app/dtos/user-details-response';
import { loadCurrentUser, loadCurrentUserFailure, loadCurrentUserSuccess, loadUsers, loadUsersFailure, loadUsersSuccess, updateCurrentUser } from './user.actions';
import { CurrentUserDetailsResponse } from 'src/app/dtos/current-user-details-response';

export enum UserStateStatus {
  Pending = 'pending',
  Loading = 'loading',
  Error = 'error',
  Success = 'success',
}

export interface UserState {
  users: UserDetailsResponse[];
  currentUser: CurrentUserDetailsResponse | null;
  error: string | null;
  status: UserStateStatus;
}

export const initialState: UserState = {
  users: [],
  currentUser: null,
  error: null,
  status: UserStateStatus.Pending,
};

export const userReducer = createReducer(
  initialState,
  on(loadCurrentUser, (state) => ({ ...state, status: UserStateStatus.Loading, error: null })),
  on(loadCurrentUserSuccess, (state, { currentUser }) => ({
    ...state,
    currentUser: currentUser,
    status: UserStateStatus.Success,
    error: null,
  })),
  on(loadCurrentUserFailure, (state, { error }) => ({
    ...state,
    error: error,
    status: UserStateStatus.Error,
  })),
  on(updateCurrentUser, (state, { currentUser }) => ({
    ...state,
    currentUser: currentUser,
    status: UserStateStatus.Loading,
    error: null,
  })),
  on(loadUsers, (state) => ({
    ...state,
    status: UserStateStatus.Loading,
    error: null,
  })),
  on(loadUsersSuccess, (state, { users }) => ({
    ...state,
    users: users,
    status: UserStateStatus.Success,
    error: null,
  })),
  on(loadUsersFailure, (state, { error }) => ({
    ...state,
    error: error,
    status: UserStateStatus.Error,
  }))
);
